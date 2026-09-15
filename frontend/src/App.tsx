/**
 * The application shell: the family's header, the routed page, and the footer
 * that links every sister site.
 *
 * The page a visitor is on is state — `state.view.tab` — and the address is a
 * mirror of it, kept in step by `startRouter`. A link written for a course
 * frames the tool with `?embed`, and the chrome is then not rendered at all:
 * what a host page frames already carries its own navigation.
 */

import { useSignals } from '@preact/signals-react/runtime';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { NavItem } from 'react-cheminfo/ui';
import {
  CiteButton,
  EcosystemButton,
  HiddenPartsProvider,
  NavLink,
  ShareButton,
  ShareDialog,
  SiteFooter,
  SiteHeader,
  SiteMark,
  SiteTheme,
  useCompactHeader,
} from 'react-cheminfo/ui';

import { ABOUT } from './about.ts';
import { About } from './pages/About.tsx';
import HomePage from './pages/home/HomePage.tsx';
import type { TabId } from './routes.ts';
import {
  REPOSITORY,
  ROUTES,
  SITE_ID,
  SITE_NAME,
  routeForTab,
} from './routes.ts';
import {
  SHARE_VOCABULARY,
  navigate,
  router,
  startRouter,
  state,
} from './state/index.ts';

/** About is a utility, so it is not one of the pages listed beside the brand. */
const ABOUT_TAB: TabId = 'about';

/**
 * The whole application: chrome, and the one page the address names.
 * @returns The shell.
 */
export default function App(): ReactElement {
  useSignals();
  const tab = state.view.tab.value;
  const share = state.view.share.value;
  const [isSharing, setIsSharing] = useState(false);
  const compact = useCompactHeader();

  useEffect(startRouter, []);

  return (
    <HiddenPartsProvider hidden={share.hidden}>
      <SiteTheme siteId={SITE_ID} />

      <div className="app-screen">
        <SiteHeader
          siteId={SITE_ID}
          width="full"
          embedded={share.embed}
          activeId={tab}
          nav={navItems()}
          onHome={() => {
            navigate('converter');
          }}
          markSize={24}
          actions={
            <>
              {/* About leads the utilities on every site of the family, and is a
                real address rather than a dialog: a page is indexed, linkable
                and printable. */}
              <NavLink
                item={{
                  id: ABOUT_TAB,
                  label: 'About',
                  icon: <SiteMark siteId={SITE_ID} size={14} />,
                  href: '/about',
                  title: `What ${SITE_NAME} converts with, and what it borrows`,
                  onSelect: () => {
                    navigate(ABOUT_TAB);
                  },
                }}
                active={tab === ABOUT_TAB}
              />
              <NavLink
                item={{
                  id: 'api',
                  label: 'API',
                  icon: 'code',
                  href: '/docs',
                  external: true,
                  title: 'OpenAPI documentation for the conversion API',
                }}
              />
              <CiteButton works={ABOUT.cite ?? []} compact={compact} />
              <EcosystemButton currentSiteId={SITE_ID} compact={compact} />
              <ShareButton
                compact={compact}
                onClick={() => {
                  setIsSharing(true);
                }}
              />
            </>
          }
        />

        <main
          className={share.embed ? 'app-main app-main--embedded' : 'app-main'}
          data-testid={`page-${tab}`}
        >
          {tab === ABOUT_TAB ? <About /> : <HomePage />}
        </main>
      </div>

      <SiteFooter
        siteId={SITE_ID}
        width="full"
        embedded={share.embed}
        heading="The rest of the cheminfo family"
      >
        <p className="app-footer-note">
          Open source, MIT licensed —{' '}
          <a href={REPOSITORY} target="_blank" rel="noreferrer noopener">
            the sources of this site
          </a>
          . The conversion itself is{' '}
          <a
            href="https://openbabel.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open Babel
          </a>
          , and every option here is one the <a href="/docs">HTTP API</a> takes
          too.
        </p>
      </SiteFooter>

      <ShareDialog
        isOpen={isSharing}
        onClose={() => {
          setIsSharing(false);
        }}
        vocabulary={SHARE_VOCABULARY}
        title={`${routeForTab(tab).label} — ${SITE_NAME}`}
        frameTitle={`${routeForTab(tab).label} — ${SITE_NAME}`}
      />
    </HiddenPartsProvider>
  );
}

/**
 * The pages, in the order the bar lists them.
 *
 * Each is a real address as well as an action, so a crawler walks the site and
 * a middle click opens the page in a tab of its own.
 * @returns One entry per page, About excepted.
 */
function navItems(): NavItem[] {
  const items: NavItem[] = [];
  for (const route of ROUTES) {
    if (route.tab === ABOUT_TAB) continue;
    items.push({
      id: route.tab,
      label: route.label,
      href: router.format({ tab: route.tab }),
      onSelect: () => {
        navigate(route.tab);
      },
    });
  }
  return items;
}
