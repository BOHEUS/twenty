import { type ApplicationEntity } from 'src/engine/core-modules/application/application.entity';

export const findDependentApplications = <
  TApplication extends Pick<ApplicationEntity, 'requiredApplications'>,
>({
  applications,
  applicationUniversalIdentifier,
}: {
  applications: TApplication[];
  applicationUniversalIdentifier: string;
}): TApplication[] =>
  applications.filter((application) =>
    // Undefined while the column's upgrade command has not run yet
    (application.requiredApplications ?? []).some(
      ({ universalIdentifier }) =>
        universalIdentifier === applicationUniversalIdentifier,
    ),
  );
