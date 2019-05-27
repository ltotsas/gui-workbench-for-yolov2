/**
 * Detector service client interface
 */
export abstract class DetectorServiceClient {
  abstract makePrediction(imageFile: File, imageData: string): Promise<string>;
}
