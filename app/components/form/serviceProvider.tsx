"use client";

import React, { useState } from "react";
import { Upload, Check } from "lucide-react";
import { Card } from "../card/card";

interface FormData {
  ownerName: string;
  description: string;
  yearsInBusiness: string;
  licenses: string[];
  agreementAccepted: boolean;
  streetAddress: string;
}

export const ServiceProviderForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    description: "",
    yearsInBusiness: "",
    licenses: [],
    agreementAccepted: false,
    streetAddress: "",
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        licenses: [
          ...prev.licenses,
          ...Array.from(files).map((file) => file.name),
        ],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Complete Profile Form</h2>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  step >= i ? "bg-teal-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">Step {step} of 2</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1s gap-4">
              <div>
                {" "}
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="ownerName"
                >
                  Owner Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 "
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Service Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 "
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="yearsInBusiness"
              >
                Years in Business
              </label>
              <input
                type="number"
                id="yearsInBusiness"
                name="yearsInBusiness"
                value={formData.yearsInBusiness}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 "
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Licenses & Certifications
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg ">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 ">
                    <label
                      htmlFor="licenses"
                      className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="licenses"
                        name="licenses"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 ">
                    PDF, PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>

              {formData.licenses.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Uploaded files:</h4>
                  <ul className="mt-1 space-y-1">
                    {formData.licenses.map((file, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-500  flex items-center"
                      >
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50  rounded-lg">
              <h3 className="text-lg font-medium mb-4">Service Agreement</h3>
              <div className="prose  max-w-none">
                <p className="text-sm text-gray-600 ">
                  This Service Provider Agreement ("Agreement") is entered into
                  between [Company Name] ("Company") and the Service Provider
                  ("Provider") as of the date of acceptance.
                </p>
                <h4 className="text-base font-medium mt-4 mb-2">1. Services</h4>
                <p className="text-sm text-gray-600 ">
                  The Provider agrees to provide services as specified in the
                  service description above, meeting all quality standards and
                  requirements set by the Company.
                </p>
                <h4 className="text-base font-medium mt-4 mb-2">
                  2. Compensation
                </h4>
                <p className="text-sm text-gray-600 ">
                  Compensation will be determined based on the service type and
                  scope, with payment terms to be specified in individual
                  service orders.
                </p>
                <h4 className="text-base font-medium mt-4 mb-2">
                  3. Term and Termination
                </h4>
                <p className="text-sm text-gray-600 ">
                  This Agreement shall remain in effect until terminated by
                  either party with 30 days written notice.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreementAccepted"
                name="agreementAccepted"
                checked={formData.agreementAccepted}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreementAccepted: e.target.checked,
                  }))
                }
                className="mt-1 mr-2"
                required
              />
              <label
                htmlFor="agreementAccepted"
                className="text-sm text-gray-600 "
              >
                I have read and agree to the Service Provider Agreement
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 "
            >
              Previous
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 "
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!formData.agreementAccepted}
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed "
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </Card>
  );
};
