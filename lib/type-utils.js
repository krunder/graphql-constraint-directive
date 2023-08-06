const {
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  isNonNullType,
  isScalarType,
  isListType
} = require('graphql')
const { ConstraintStringType, validate: validateStringFn } = require('../scalars/string')
const { ConstraintNumberType, validate: validateNumberFn } = require('../scalars/number')

function getConstraintTypeObject (fieldName, type, uniqueTypeName, directiveArgumentMap) {
  if (type === GraphQLFloat || type === GraphQLInt) {
    return new ConstraintNumberType(
      fieldName,
      uniqueTypeName,
      type,
      directiveArgumentMap
    )
  }

  return new ConstraintStringType(
    fieldName,
    uniqueTypeName,
    type,
    directiveArgumentMap
  )
}

function getConstraintValidateFn (type) {
  if (type === GraphQLFloat || type === GraphQLInt) {
    return validateNumberFn
  }

  return validateStringFn
}

function getScalarType (fieldConfig) {
  if (isScalarType(fieldConfig)) {
    return { scalarType: fieldConfig }
  } else if (isListType(fieldConfig)) {
    return { ...getScalarType(fieldConfig.ofType), list: true }
  } else if (isNonNullType(fieldConfig) && isScalarType(fieldConfig.ofType)) {
    return { scalarType: fieldConfig.ofType, scalarNotNull: true }
  } else if (isNonNullType(fieldConfig)) {
    return { ...getScalarType(fieldConfig.ofType.ofType), list: true, listNotNull: true }
  } else {
    throw new Error(`Not a valid scalar type: ${fieldConfig.toString()}`)
  }
}

module.exports = { getConstraintTypeObject, getConstraintValidateFn, getScalarType }
