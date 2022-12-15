/**
 * MongoDB type that could either be the type itself or a string object id.
 *
 * Use this whenever you want to have a frontend analog for a backend type with
 * schema type: Schema.Types.ObjectId.
 *
 * For example, in the backend if you have:
 *   segments: [{ type: Schema.Types.ObjectId, ref: 'Segment' }],
 * Then in the frontend, declare it as:
 *   segments: ObjectRef<Segment>;
 *
 * TODO(nathaniel): Possible to make this a class instead?
 */
export type ObjectRef<T extends { id: any }> = T | string;

/** Returns the id of given ObjectRef. */
export function refId<T extends { id: any }>(ref?: ObjectRef<T>): string | undefined {
  if (!ref) return;
  if (typeof ref === 'string' || ref instanceof String) {
    return ref as string;
  }
  return ref.id;
}

/** Returns the object of given ObjectRef. If ObjectRef is string, return null. */
export function refObject<T extends { id: any }>(ref: ObjectRef<T>): T | undefined {
  if (typeof ref === 'string' || ref instanceof String) {
    return undefined;
  }
  return ref;
}

/** Base entity for MongoDB entities. */
export class BaseEntity {
  _id?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
