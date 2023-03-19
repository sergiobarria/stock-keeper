/**
 * @desc: Takes an object and returns a new object with the same properties but with the values of the properties being the values of the properties of the object passed in
 */
export const removeFieldsFromObject = (obj: Record<string, string>, fields: string[]): Record<string, string> => {
    const objMap = new Map(Object.entries(obj))

    fields.forEach(field => objMap.delete(field))

    return Object.fromEntries(objMap)
}

/**
 * @desc: Takes and object and returns a new object with only the specified fields
 * @param {object} obj - The object to filter
 * @param {string[]} allowedFields - The fields to keep
 * @returns {object} - The filtered object
 */
export const filterObj = (obj: Record<string, string>, ...allowedFields: string[]): Record<string, string> => {
    const newObj: Record<string, string> = {}

    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}
