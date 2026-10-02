import { parseIncludeRestRequest } from 'src/engine/api/rest/input-request-parsers/include-parser-utils/parse-include-rest-request.util';
import { RestInputRequestParserException } from 'src/engine/api/rest/input-request-parsers/rest-input-request-parser.exception';
import { type AuthenticatedRequest } from 'src/engine/api/rest/types/authenticated-request.type';

const buildRequest = (query: Record<string, unknown>) =>
  ({ query }) as unknown as AuthenticatedRequest;

describe('parseIncludeRestRequest', () => {
  it('should return an empty tree when include is not provided', () => {
    expect(parseIncludeRestRequest(buildRequest({}))).toEqual({});
  });

  it('should parse direct and nested relation paths into a tree', () => {
    expect(
      parseIncludeRestRequest(
        buildRequest({
          include: 'company.people, company.opportunities,pointOfContact',
        }),
      ),
    ).toEqual({
      company: { people: {}, opportunities: {} },
      pointOfContact: {},
    });
  });

  it('should throw when a path is deeper than 2 levels', () => {
    expect(() =>
      parseIncludeRestRequest(
        buildRequest({ include: 'company.people.company' }),
      ),
    ).toThrow(RestInputRequestParserException);
  });

  it.each([
    '',
    'company,',
    'company..people',
    '.company',
    '__proto__.polluted',
  ])('should throw on invalid relation name in "%s"', (include) => {
    expect(() => parseIncludeRestRequest(buildRequest({ include }))).toThrow(
      RestInputRequestParserException,
    );
  });

  it('should build own properties for names shadowing Object members', () => {
    const includeTree = parseIncludeRestRequest(
      buildRequest({ include: 'constructor.toString' }),
    );

    expect(
      Object.prototype.hasOwnProperty.call(includeTree, 'constructor'),
    ).toBe(true);
    expect(
      Object.prototype.hasOwnProperty.call(includeTree.constructor, 'toString'),
    ).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(Object, 'toString')).toBe(
      false,
    );
  });

  it('should throw when include is repeated', () => {
    expect(() =>
      parseIncludeRestRequest(
        buildRequest({ include: ['company', 'pointOfContact'] }),
      ),
    ).toThrow(RestInputRequestParserException);
  });
});
