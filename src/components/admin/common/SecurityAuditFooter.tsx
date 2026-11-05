interface SecurityAuditFooterProps {
  className?: string;
  protocolText?: string;
  indexRef?: string;
}

export const SecurityAuditFooter = ({
  className = '',
  protocolText = 'Security Protocol: CS Dept Strict Isolation • Academic Integrity Engine Active',
  indexRef = 'Index Ref: ARCH-2026-CS101-FACULTY-08821',
}: SecurityAuditFooterProps) => {
  return (
    <aside
      className={`mt-12 pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant font-label-mono-xs text-xs uppercase tracking-wider ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        <span>{protocolText}</span>
      </div>
      <span>{indexRef}</span>
    </aside>
  );
};

export default SecurityAuditFooter;
