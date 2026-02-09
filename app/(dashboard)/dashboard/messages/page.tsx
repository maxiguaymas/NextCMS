import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { markAsRead } from "./actions";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mensajes de Contacto</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Tienes {messages.length} mensajes recibidos a través del formulario.
        </p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">mail_outline</span>
            <p className="text-slate-500">No hay mensajes todavía.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${!msg.read ? 'border-l-4 border-l-[#068ce5] border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 opacity-80'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center font-bold ${!msg.read ? 'bg-[#068ce5] text-white' : 'bg-[#068ce5]/10 text-[#068ce5]'}`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{msg.name}</h3>
                    <p className="text-xs text-slate-500">{msg.email}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: es })}
                </div>
              </div>
              
              <div className="pl-1">
                <h4 className="text-sm font-bold text-[#068ce5] mb-2">Asunto: {msg.subject}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                {!msg.read ? (
                  <form action={async () => {
                    'use server';
                    await markAsRead(msg.id);
                  }}>
                    <button className="text-xs font-bold text-[#068ce5] hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">done_all</span>
                      Marcar como leído
                    </button>
                  </form>
                ) : <span className="text-xs text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">done_all</span> Leído</span>}
                
                <div className="flex gap-4">
                  <a href={`mailto:${msg.email}`} className="text-xs font-bold text-slate-500 hover:text-[#068ce5] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Responder
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}