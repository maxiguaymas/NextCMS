'use client';

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUsers, updateUserStatus, updateUserRole } from "./actions";

export default function UsersPage() {
  const { data: session } = useSession();
  const currentUserRole = (session?.user as any)?.role || "VIEWER";
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await getUsers();
    if (result.success) {
      setUsers(result.data || []);
    } else {
      setError(result.error || "Ocurrió un error al cargar los usuarios");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    if (selectedUser.id === (session?.user as any)?.id) {
      alert("No puedes desactivarte a ti mismo.");
      setShowDeleteModal(false);
      return;
    }
    
    const result = await updateUserStatus(selectedUser.id, !selectedUser.active);
    if (result.success) {
      fetchUsers();
      setShowDeleteModal(false);
    } else {
      alert(result.error);
    }
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (!selectedUser) return;
    const result = await updateUserRole(selectedUser.id, newRole);
    if (result.success) {
      fetchUsers();
      setShowRoleModal(false);
    } else {
      alert(result.error);
    }
  };

  // Lógica de filtrado combinada
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || 
                          (statusFilter === "ACTIVE" ? user.active : !user.active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-slate-500 dark:text-[#8F9BA8] mt-1">Administra los miembros de tu equipo, sus roles y permisos de acceso.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#028ce8] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#028ce8]/20 hover:bg-[#028ce8]/90 transition-all active:scale-95">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Nuevo Usuario
        </button>
      </header>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
          </div>
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="block w-full pl-10 pr-4 py-2 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-xl text-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#028ce8]/20 focus:border-[#028ce8] transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Filtro de Rol */}
          <div className="relative flex-1 md:flex-none">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center justify-center gap-2 h-10 px-4 w-full rounded-xl border transition-all text-xs font-bold shadow-sm ${
                roleFilter !== 'ALL' 
                ? 'border-[#028ce8] bg-[#028ce8]/5 text-[#028ce8]' 
                : 'border-gray-200 dark:border-[#282d33] bg-white dark:bg-[#16181c] text-slate-600 dark:text-[#8F9BA8] hover:border-[#028ce8]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>{roleFilter === 'ALL' ? 'Todos los Roles' : roleFilter}</span>
            </button>
            {showRoleDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {['ALL', 'ADMIN', 'EDITOR', 'VIEWER'].map((r) => (
                    <button 
                      key={r}
                      onClick={() => { setRoleFilter(r); setShowRoleDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${roleFilter === r ? 'text-[#028ce8] font-bold bg-[#028ce8]/5' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {r === 'ALL' ? 'Todos los Roles' : r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filtro de Estado */}
          <div className="relative flex-1 md:flex-none">
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`flex items-center justify-center gap-2 h-10 px-4 w-full rounded-xl border transition-all text-xs font-bold shadow-sm ${
                statusFilter !== 'ALL' 
                ? 'border-[#028ce8] bg-[#028ce8]/5 text-[#028ce8]' 
                : 'border-gray-200 dark:border-[#282d33] bg-white dark:bg-[#16181c] text-slate-600 dark:text-[#8F9BA8] hover:border-[#028ce8]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{statusFilter === 'ALL' ? 'Todos los Estados' : statusFilter === 'ACTIVE' ? 'Activos' : 'Inactivos'}</span>
            </button>
            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { id: 'ALL', label: 'Todos los Estados' },
                    { id: 'ACTIVE', label: 'Solo Activos' },
                    { id: 'INACTIVE', label: 'Solo Inactivos' }
                  ].map((s) => (
                    <button 
                      key={s.id}
                      onClick={() => { setStatusFilter(s.id); setShowStatusDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${statusFilter === s.id ? 'text-[#028ce8] font-bold bg-[#028ce8]/5' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#16181c]/50 border border-gray-200 dark:border-[#282d33] rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-sm animate-pulse">Cargando usuarios...</div>
        ) : error ? (
          <div className="py-24 text-center text-red-500 text-sm font-medium">{error}</div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#282d33]/50 bg-gray-50/50 dark:bg-[#0f1115]/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8F9BA8]">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8F9BA8]">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8F9BA8]">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8F9BA8]">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8F9BA8] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#282d33]/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-[#282d33] flex items-center justify-center text-sm font-bold text-[#028ce8]">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-[#8F9BA8]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                        user.role === 'ADMIN' 
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                          : user.role === 'EDITOR'
                          ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${user.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-400'}`}></span>
                        <span className="text-sm font-medium text-slate-600 dark:text-[#8F9BA8]">
                          {user.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedUser(user); setShowRoleModal(true); }}
                          className="p-2 text-slate-400 hover:text-[#028ce8] hover:bg-[#028ce8]/10 rounded-xl transition-all" 
                          title="Cambiar Rol"
                          disabled={currentUserRole !== 'ADMIN'}
                        >
                          <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                        </button>
                        <button 
                          onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                          className={`p-2 rounded-xl transition-all ${
                            user.active 
                              ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10' 
                              : 'text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                          title={user.active ? "Desactivar Usuario" : "Activar Usuario"}
                          disabled={currentUserRole !== 'ADMIN'}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {user.active ? 'person_off' : 'person_check'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center mb-6 border border-gray-100 dark:border-[#282d33]">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">group</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {users.length === 0 ? "No hay usuarios registrados" : "No hay coincidencias"}
            </h3>
            <p className="text-slate-500 dark:text-[#8F9BA8] max-w-xs mb-8">
              {users.length === 0 ? "Comienza creando un nuevo miembro para tu equipo." : "Intenta ajustar los filtros o el término de búsqueda."}
            </p>
          </div>
        )}
      </div>

      {/* Modal para Cambiar Rol */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cambiar rol de {selectedUser?.name}</h3>
            <div className="grid grid-cols-1 gap-2 mb-6">
              {['ADMIN', 'EDITOR', 'VIEWER'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleUpdate(role)}
                  className={`px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedUser?.role === role 
                    ? 'border-[#028ce8] bg-[#028ce8]/5 text-[#028ce8]' 
                    : 'border-gray-100 dark:border-[#282d33] text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowRoleModal(false)}
              className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar (Desactivar) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className={`flex items-center gap-3 mb-4 ${selectedUser?.active ? 'text-red-500' : 'text-emerald-500'}`}>
              <span className="material-symbols-outlined text-3xl">
                {selectedUser?.active ? 'person_off' : 'person_check'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedUser?.active ? 'Desactivar' : 'Activar'} usuario
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              ¿Estás seguro de que deseas {selectedUser?.active ? 'desactivar' : 'activar'} a <strong>{selectedUser?.name}</strong>? 
              {selectedUser?.active 
                ? ' El usuario ya no podrá acceder al sistema, pero sus datos se conservarán.' 
                : ' El usuario recuperará el acceso al sistema.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#282d33] text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleToggleStatus}
                className={`flex-1 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-lg ${
                  selectedUser?.active 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                }`}
              >
                {selectedUser?.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}