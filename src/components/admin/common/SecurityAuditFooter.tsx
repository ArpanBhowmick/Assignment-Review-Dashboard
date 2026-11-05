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
      className={`mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant font-label-mono-xs text-xs uppercase tracking-wider text-center sm:text-left ${className}`}
    >
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
        <span>{protocolText}</span>
      </div>
      <span className="break-all sm:break-normal text-center sm:text-right">{indexRef}</span>
    </aside>
  );
};

export default SecurityAuditFooter;
