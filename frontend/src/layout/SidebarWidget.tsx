export default function SidebarWidget() {
  return (
    <div className="mt-4 mb-4 mx-1">
      <div
        className="w-full rounded-2xl px-4 py-4 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(81, 39, 131, 0.08) 0%, rgba(241, 137, 24, 0.06) 100%)",
          border: "1px solid rgba(81, 39, 131, 0.1)",
        }}
      >
        <h3 className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-white">
          Unity Financial
        </h3>
        <p className="mb-3 text-gray-500 text-xs leading-relaxed dark:text-gray-400">
          Plataforma financiera integral con herramientas avanzadas.
        </p>
        <a
          href="#"
          className="flex items-center justify-center p-2.5 font-medium text-white rounded-xl bg-brand-500 text-xs hover:bg-brand-600 transition-colors"
        >
          Ver Planes
        </a>
      </div>
    </div>
  );
}
