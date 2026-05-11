import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PreFormSections } from "@/components/PreFormSections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { registrationContent } from "@/data/registrationContent";
import { COURSE_INTEREST_OPTIONS } from "@/data/registrationFormOptions";
import { getUtmParams, submitRegistration } from "@/lib/registration";

type ExhibitorForm = {
  instituteName: string;
  location: string;
  contactPersonName: string;
  designation: string;
  mobileNumber: string;
  whatsappSameAsMobile: boolean;
  whatsappNumber: string;
  email: string;
  coursesOffered: string;
  admissionPreferences: string[];
  scholarshipType: string;
  scholarshipDetails: string;
  stallSelection: string;
  honeypot: string;
};

const DESIGNATION_OPTIONS = [
  "Chairman",
  "Director",
  "Principal",
  "Admission Head",
  "Marketing Manager",
  "Other",
] as const;

const ADMISSION_PREFERENCES = ["After 10th", "After 12th", "UG", "PG"] as const;

const SCHOLARSHIP_OPTIONS = ["Scholarships", "Concessions", "Donation-Free", "All", "No"] as const;

const STALL_OPTIONS = ["Diamond", "Platinum", "Gold", "Silver", "Basic"] as const;

const ExhibitorRegistration = () => {
  const location = useLocation();
  const utm = useMemo(() => getUtmParams(location.search), [location.search]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<ExhibitorForm>({
    instituteName: "",
    location: "",
    contactPersonName: "",
    designation: "",
    mobileNumber: "",
    whatsappSameAsMobile: true,
    whatsappNumber: "",
    email: "",
    coursesOffered: "",
    admissionPreferences: [],
    scholarshipType: "",
    scholarshipDetails: "",
    stallSelection: "",
    honeypot: "",
  });

  const toggleAdmissionPreference = (value: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      admissionPreferences: checked
        ? [...prev.admissionPreferences, value]
        : prev.admissionPreferences.filter((item) => item !== value),
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.instituteName.trim()) next.instituteName = "Institute Name is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.contactPersonName.trim()) next.contactPersonName = "Contact Person Full Name is required";
    if (!form.designation) next.designation = "Please select Designation";
    if (!/^\d{10}$/.test(form.mobileNumber)) next.mobileNumber = "Mobile Number must be exactly 10 digits";
    if (!form.whatsappSameAsMobile && !/^\d{10}$/.test(form.whatsappNumber)) {
      next.whatsappNumber = "WhatsApp Number must be exactly 10 digits";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid Email";
    if (!form.coursesOffered) next.coursesOffered = "Please select Courses Offered";
    if (form.admissionPreferences.length === 0) {
      next.admissionPreferences = "Select at least one Admission Preference";
    }
    if (!form.scholarshipType) next.scholarshipType = "Please select Scholarship option";
    if (!form.stallSelection) next.stallSelection = "Please select Stall Selection";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitRegistration({
        form_type: "exhibitor",
        timestamp: new Date().toISOString(),
        institute_name: form.instituteName,
        institute_location: form.location,
        contact_person_full_name: form.contactPersonName,
        designation: form.designation,
        mobile_number: form.mobileNumber,
        whatsapp_same_as_mobile: form.whatsappSameAsMobile ? "Yes" : "No",
        whatsapp_number: form.whatsappSameAsMobile ? form.mobileNumber : form.whatsappNumber,
        email_id: form.email,
        courses_offered: form.coursesOffered,
        admission_preferences: form.admissionPreferences,
        scholarship_option: form.scholarshipType,
        scholarship_details: form.scholarshipDetails,
        stall_selection: form.stallSelection,
        honeypot: form.honeypot,
        utm,
      });

      setForm({
        instituteName: "",
        location: "",
        contactPersonName: "",
        designation: "",
        mobileNumber: "",
        whatsappSameAsMobile: true,
        whatsappNumber: "",
        email: "",
        coursesOffered: "",
        admissionPreferences: [],
        scholarshipType: "",
        scholarshipDetails: "",
        stallSelection: "",
        honeypot: "",
      });
      setErrors({});
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-4 pb-24 pt-24 md:px-6">
        <PreFormSections sections={registrationContent.exhibitor} />

        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Exhibitor Registration Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <div className="rounded-xl border border-orange-300 bg-orange-50 p-6 text-center">
                  <h3 className="text-xl font-semibold text-orange-700">Booking Request Submitted ✅</h3>
                  <p className="mt-2 text-sm text-orange-700">Your form has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Institute Info</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Institute Name *</Label>
                        <Input
                          value={form.instituteName}
                          onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                        />
                        {errors.instituteName && <p className="text-xs text-destructive">{errors.instituteName}</p>}
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Location *</Label>
                        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">2. Contact Person</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Full Name *</Label>
                        <Input
                          value={form.contactPersonName}
                          onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })}
                        />
                        {errors.contactPersonName && <p className="text-xs text-destructive">{errors.contactPersonName}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Designation *</Label>
                        <Select value={form.designation} onValueChange={(value) => setForm({ ...form, designation: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            {DESIGNATION_OPTIONS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Mobile Number *</Label>
                        <Input
                          inputMode="numeric"
                          maxLength={10}
                          value={form.mobileNumber}
                          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, "") })}
                        />
                        {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber}</p>}
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <label className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                          <Checkbox
                            checked={form.whatsappSameAsMobile}
                            onCheckedChange={(checked) =>
                              setForm({
                                ...form,
                                whatsappSameAsMobile: checked === true,
                                whatsappNumber: checked === true ? "" : form.whatsappNumber,
                              })
                            }
                          />
                          WhatsApp Same as Mobile
                        </label>
                      </div>

                      {!form.whatsappSameAsMobile && (
                        <div className="grid gap-2 md:col-span-2">
                          <Label>WhatsApp Number *</Label>
                          <Input
                            inputMode="numeric"
                            maxLength={10}
                            value={form.whatsappNumber}
                            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, "") })}
                          />
                          {errors.whatsappNumber && <p className="text-xs text-destructive">{errors.whatsappNumber}</p>}
                        </div>
                      )}

                      <div className="grid gap-2 md:col-span-2">
                        <Label>Email *</Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Courses Offered</h3>
                    <div className="grid gap-2">
                      <Label>Courses Offered *</Label>
                      <Select value={form.coursesOffered} onValueChange={(value) => setForm({ ...form, coursesOffered: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course category" />
                        </SelectTrigger>
                        <SelectContent>
                          {COURSE_INTEREST_OPTIONS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.coursesOffered && <p className="text-xs text-destructive">{errors.coursesOffered}</p>}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">4. Admission Preferences</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ADMISSION_PREFERENCES.map((item) => (
                        <label key={item} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                          <Checkbox
                            checked={form.admissionPreferences.includes(item)}
                            onCheckedChange={(checked) => toggleAdmissionPreference(item, checked === true)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                    {errors.admissionPreferences && <p className="text-xs text-destructive">{errors.admissionPreferences}</p>}
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">5. Scholarships</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Option *</Label>
                        <Select
                          value={form.scholarshipType}
                          onValueChange={(value) => setForm({ ...form, scholarshipType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {SCHOLARSHIP_OPTIONS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.scholarshipType && <p className="text-xs text-destructive">{errors.scholarshipType}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Details</Label>
                        <Textarea
                          value={form.scholarshipDetails}
                          onChange={(e) => setForm({ ...form, scholarshipDetails: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">6. Stall Selection</h3>
                    <div className="grid gap-2">
                      <Label>Stall Type *</Label>
                      <Select value={form.stallSelection} onValueChange={(value) => setForm({ ...form, stallSelection: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stall" />
                        </SelectTrigger>
                        <SelectContent>
                          {STALL_OPTIONS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.stallSelection && <p className="text-xs text-destructive">{errors.stallSelection}</p>}
                    </div>
                  </section>

                  <input
                    type="text"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  />

                  {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                  <Button onClick={handleSubmit} disabled={submitting} className="w-full" size="lg">
                    {submitting ? "Submitting..." : "Submit Booking"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExhibitorRegistration;
