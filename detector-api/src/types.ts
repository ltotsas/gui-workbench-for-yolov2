/**
 * The types for dependency injection
 */
const TYPES = {
    DetectorClient: Symbol('DetectorClient'),
    AnnotationClient : Symbol ('AnnotationClient'),
    ProjectClient : Symbol ('ProjectClient'),
    TrainingClient : Symbol ('TrainingClient'),
};

export default TYPES;
