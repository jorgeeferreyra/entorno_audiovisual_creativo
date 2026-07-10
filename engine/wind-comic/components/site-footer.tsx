'use client';

import { useLocale } from '@/hooks/use-locale';

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="px-[5vw] py-[60px] bg-[#0A0A0A] border-t border-[var(--border)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex flex-col mb-3">
            <span className="text-[22px] font-bold brand-gradient">青枫漫剧</span>
            <span className="text-xs text-[var(--soft)]">QingFeng Manju</span>
          </div>
          <p className="text-sm text-[var(--soft)]">{t.footer.tagline}</p>
          <p className="text-sm text-[var(--soft)] mt-1">hello@qfmanju.ai</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t.footer.colProduct}</h4>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkFeatures}</p>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkPricing}</p>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkCases}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t.footer.colCompany}</h4>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkAbout}</p>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkCareers}</p>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkPrivacy}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t.footer.colResources}</h4>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkDocs}</p>
          <p className="text-sm text-[var(--soft)] mb-1.5">{t.footer.linkSupport}</p>
        </div>
      </div>
    </footer>
  );
}
