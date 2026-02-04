"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Metadata } from "next";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNum: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent.",
      });
      setFormData({
        fullName: "",
        phoneNum: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 uppercase text-center">
          CONTACT US
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name and Phone Number Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2 uppercase"
              >
                FULL NAME
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNum"
                className="block text-sm font-medium mb-2 uppercase"
              >
                PHONE NUM
              </label>
              <input
                type="tel"
                id="phoneNum"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 uppercase"
            >
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2 uppercase"
            >
              MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Submit Status */}
          {submitStatus.type && (
            <div
              className={`p-4 border-2 ${
                submitStatus.type === "success"
                  ? "border-green-500 bg-green-50 text-green-800"
                  : "border-red-500 bg-red-50 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="border-2 border-black px-12"
            >
              {isSubmitting ? "SENDING..." : "SUBMIT"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

