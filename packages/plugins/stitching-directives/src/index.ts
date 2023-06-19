import { Plugin } from '@envelop/types';
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema';
import { stitchingDirectives } from '@graphql-tools/stitching-directives';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

export const useStitchingDirectives = (): Plugin => {
  return {
    onSchemaChange({ schema, replaceSchema }) {
      const { allStitchingDirectivesTypeDefs } = stitchingDirectives();

      const mergedSchema = mergeSchemas({
        schemas: [schema],
        typeDefs: /* GraphQL */ `
          ${allStitchingDirectivesTypeDefs}
          type Query {
            _sdl: String!
          }
        `,
      });

      const _sdl = printSchemaWithDirectives(mergedSchema);

      const finalSchema = addResolversToSchema({
        schema: mergedSchema,
        resolvers: {
          Query: {
            _sdl: () => _sdl,
          },
        },
      });

      replaceSchema(finalSchema);
    },
  };
};
