import { useRecoilValue } from 'recoil';
import {
  IconApps,
  IconAt,
  IconCalendarEvent,
  IconCode,
  IconColorSwatch,
  IconComponent,
  IconCurrencyDollar,
  IconDoorEnter,
  IconFunction,
  IconHierarchy2,
  IconMail,
  IconRocket,
  IconSettings,
  IconUserCircle,
  IconUsers,
} from 'twenty-ui';

import { useAuth } from '@/auth/hooks/useAuth';
import { billingState } from '@/client-config/states/billingState';
import { SettingsNavigationDrawerItem } from '@/settings/components/SettingsNavigationDrawerItem';
import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import {
  NavigationDrawerItem,
  NavigationDrawerItemIndentationLevel,
} from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerItemGroup } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItemGroup';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { getNavigationSubItemState } from '@/ui/navigation/navigation-drawer/utils/getNavigationSubItemState';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { matchPath, resolvePath, useLocation } from 'react-router-dom';

type SettingsNavigationItem = {
  label: string;
  path: SettingsPath;
  Icon: IconComponent;
  matchSubPages?: boolean;
  indentationLevel?: NavigationDrawerItemIndentationLevel;
  dataTestId?: string;
};

export const SettingsNavigationDrawerItems = () => {
  const { signOut } = useAuth();

  const billing = useRecoilValue(billingState);
  const isFunctionSettingsEnabled = useIsFeatureEnabled(
    'IS_FUNCTION_SETTINGS_ENABLED',
  );
  const isFreeAccessEnabled = useIsFeatureEnabled('IS_FREE_ACCESS_ENABLED');
  const isCRMMigrationEnabled = useIsFeatureEnabled('IS_CRM_MIGRATION_ENABLED');
  const isBillingPageEnabled =
    billing?.isBillingEnabled && !isFreeAccessEnabled;

  // TODO: Refactor this part to only have arrays of navigation items
  const currentPathName = useLocation().pathname;

  const accountSubSettings: SettingsNavigationItem[] = [
    {
      label: 'Emails',
      path: SettingsPath.AccountsEmails,
      Icon: IconMail,
      matchSubPages: true,
      indentationLevel: 2,
      dataTestId: 'accounts-emails-button',
    },
    {
      label: 'Calendars',
      path: SettingsPath.AccountsCalendars,
      Icon: IconCalendarEvent,
      matchSubPages: true,
      indentationLevel: 2,
      dataTestId: 'accounts-calendar-button',
    },
  ];

  const selectedIndex = accountSubSettings.findIndex((accountSubSetting) => {
    const href = getSettingsPagePath(accountSubSetting.path);
    const pathName = resolvePath(href).pathname;

    return matchPath(
      {
        path: pathName,
        end: !accountSubSetting.matchSubPages,
      },
      currentPathName,
    );
  });

  return (
    <>
      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="User" />
        <SettingsNavigationDrawerItem
          label="Profile"
          path={SettingsPath.ProfilePage}
          Icon={IconUserCircle}
          dataTestId="profile-menu-item"
        />
        <SettingsNavigationDrawerItem
          label="Experience"
          path={SettingsPath.Appearance}
          Icon={IconColorSwatch}
          dataTestId="experience-menu-item"
        />
        <NavigationDrawerItemGroup>
          <SettingsNavigationDrawerItem
            label="Accounts"
            path={SettingsPath.Accounts}
            Icon={IconAt}
            dataTestId="account-menu-item"
          />
          {accountSubSettings.map((navigationItem, index) => (
            <SettingsNavigationDrawerItem
              key={index}
              label={navigationItem.label}
              path={navigationItem.path}
              Icon={navigationItem.Icon}
              indentationLevel={navigationItem.indentationLevel}
              subItemState={getNavigationSubItemState({
                arrayLength: accountSubSettings.length,
                index,
                selectedIndex,
              })}
              dataTestId={navigationItem.dataTestId}
            />
          ))}
        </NavigationDrawerItemGroup>
      </NavigationDrawerSection>
      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="Workspace" />
        <SettingsNavigationDrawerItem
          label="General"
          path={SettingsPath.Workspace}
          Icon={IconSettings}
          dataTestId="general-menu-item"
        />
        <SettingsNavigationDrawerItem
          label="Members"
          path={SettingsPath.WorkspaceMembersPage}
          Icon={IconUsers}
          dataTestId="members-menu-item"
        />
        {isBillingPageEnabled && (
          <SettingsNavigationDrawerItem
            label="Billing"
            path={SettingsPath.Billing}
            Icon={IconCurrencyDollar}
            dataTestId="billing-menu-item"
          />
        )}
        <SettingsNavigationDrawerItem
          label="Data model"
          path={SettingsPath.Objects}
          Icon={IconHierarchy2}
          matchSubPages
          dataTestId="data-model-menu-item"
        />
        <SettingsNavigationDrawerItem
          label="Developers"
          path={SettingsPath.Developers}
          Icon={IconCode}
          dataTestId="developers-menu-item"
        />
        {isFunctionSettingsEnabled && (
          <SettingsNavigationDrawerItem
            label="Functions"
            path={SettingsPath.ServerlessFunctions}
            Icon={IconFunction}
            dataTestId="functions-menu-item"
          />
        )}
        <SettingsNavigationDrawerItem
          label="Integrations"
          path={SettingsPath.Integrations}
          Icon={IconApps}
          dataTestId="integrations-menu-item"
        />
        {isCRMMigrationEnabled && (
          <SettingsNavigationDrawerItem
            label="CRM Migration"
            path={SettingsPath.CRMMigration}
            Icon={IconCode}
            dataTestId="crm-migration-menu-item"
          />
        )}
      </NavigationDrawerSection>
      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="Other" />
        <SettingsNavigationDrawerItem
          label="Releases"
          path={SettingsPath.Releases}
          Icon={IconRocket}
          dataTestId="releases-menu-item"
        />
        <NavigationDrawerItem
          label="Logout"
          onClick={signOut}
          Icon={IconDoorEnter}
          dataTestId="logout-menu-item"
        />
      </NavigationDrawerSection>
    </>
  );
};
