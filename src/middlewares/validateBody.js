import createHttpError from 'http-errors';


export const validateBody = (schema) => async (req, res, next) => {
try {
if (!schema) return next();
const value = await schema.validateAsync(req.body, {
abortEarly: false, // tüm hataları topla
stripUnknown: true, // şemada olmayan alanları at
convert: true,
});
req.body = value;
next();
} catch (err) {
if (err.isJoi) {
return next(
createHttpError(400, 'Validation error', {
errors: err.details.map(d => ({ path: d.path.join('.'), message: d.message })),
})
);
}
next(err);
}
};