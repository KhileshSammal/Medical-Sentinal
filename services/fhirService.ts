
import { MedicalReport } from "../types";

/**
 * Converts internal MedicalReport structure to a FHIR R4 DiagnosticReport Bundle
 */
export const exportToFHIR = (report: MedicalReport): string => {
  const bundle = {
    resourceType: "Bundle",
    type: "collection",
    entry: [
      {
        resource: {
          resourceType: "DiagnosticReport",
          id: report.id,
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                  code: report.type === 'BLOOD' ? 'LAB' : 'OTH',
                  display: report.type
                }
              ]
            }
          ],
          code: {
            text: report.labName + " Panel"
          },
          effectiveDateTime: report.date,
          issued: new Date().toISOString(),
          conclusion: report.summary
        }
      },
      ...report.markers.map(marker => ({
        resource: {
          resourceType: "Observation",
          id: `${report.id}-${marker.name.replace(/\s+/g, '-').toLowerCase()}`,
          status: "final",
          code: {
            text: marker.name
          },
          valueQuantity: {
            value: marker.value,
            unit: marker.unit,
            system: "http://unitsofmeasure.org"
          },
          referenceRange: [
            {
              text: marker.referenceRange
            }
          ],
          interpretation: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                  code: marker.status === 'OPTIMAL' ? 'N' : (marker.status === 'CRITICAL' ? 'AA' : 'A'),
                  display: marker.status
                }
              ]
            }
          ]
        }
      }))
    ]
  };

  return JSON.stringify(bundle, null, 2);
};

export const downloadFHIR = (report: MedicalReport) => {
  const json = exportToFHIR(report);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sentinel-fhir-${report.labName}-${report.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
