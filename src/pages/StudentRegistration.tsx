import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PreFormSections } from "@/components/PreFormSections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registrationContent } from "@/data/registrationContent";
import { COURSE_INTEREST_OPTIONS } from "@/data/registrationFormOptions";
import { getUtmParams, submitRegistration } from "@/lib/registration";

type StudentForm = {
  fullName: string;
  mobile: string;
  email: string;
  cityDistrict: string;
  parentName: string;
  parentOccupation: string;
  annualIncome: string;
  currentQualification: string;
  courseInterest: string;
  studyPreference: string;
  honeypot: string;
};

const PARENT_OCCUPATION_OPTIONS = [
  "Government Job",
  "Private Employee",
  "Business",
  "Farmer",
  "Self-employed",
  "Others",
] as const;

const ANNUAL_INCOME_OPTIONS = ["<2 Lakhs", "2–5 Lakhs", "5–10 Lakhs", "10 Lakhs+"] as const;

const CURRENT_QUALIFICATION_OPTIONS = [
  "12th Passed",
  "Studying 12th",
  "Diploma",
  "Graduate",
  "Final Year UG",
] as const;

const StudentRegistration = () => {
  const location = useLocation();
  const utm = useMemo(() => getUtmParams(location.search), [location.search]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<StudentForm>({
    fullName: "",
    mobile: "",
    email: "",
    cityDistrict: "",
    parentName: "",
    parentOccupation: "",
    annualIncome: "",
    currentQualification: "",
    courseInterest: "",
    studyPreference: "",
    honeypot: "",
  });

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.fullName.trim()) next.fullName = "Full Name is required";
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = "Mobile Number must be exactly 10 digits";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid Email ID";
    if (!form.cityDistrict.trim()) next.cityDistrict = "City / District is required";
    if (!form.parentName.trim()) next.parentName = "Parent Name is required";
    if (!form.parentOccupation) next.parentOccupation = "Please select Parent Occupation";
    if (!form.annualIncome) next.annualIncome = "Please select Annual Income";
    if (!form.currentQualification) next.currentQualification = "Please select Current Qualification";
    if (!form.courseInterest) next.courseInterest = "Please select Course Interest";
    if (!form.studyPreference) next.studyPreference = "Please select your study preference";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitRegistration({
        form_type: "student",
        timestamp: new Date().toISOString(),
        full_name: form.fullName,
        mobile_number: form.mobile,
        email_id: form.email,
        city_district: form.cityDistrict,
        parent_name: form.parentName,
        parent_occupation: form.parentOccupation,
        annual_income: form.annualIncome,
        current_qualification: form.currentQualification,
        course_interest: form.courseInterest,
        studyPreference: form.studyPreference,
        honeypot: form.honeypot,
        utm,
      });

      setForm({
        fullName: "",
        mobile: "",
        email: "",
        cityDistrict: "",
        parentName: "",
        parentOccupation: "",
        annualIncome: "",
        currentQualification: "",
        courseInterest: "",
        studyPreference: "",
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
        <PreFormSections sections={registrationContent.student} />

        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Student Registration Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <div className="rounded-xl border border-orange-300 bg-orange-50 p-6 text-center">
                  <h3 className="text-xl font-semibold text-orange-700">Registration Submitted ✅</h3>
                  <p className="mt-2 text-sm text-orange-700">Your form has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Full Name *</Label>
                        <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label>Mobile Number *</Label>
                        <Input
                          inputMode="numeric"
                          maxLength={10}
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
                        />
                        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label>Email ID *</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>

                      <div className="grid gap-2 md:col-span-2">
                        <Label>City / District *</Label>
                        <Input
                          value={form.cityDistrict}
                          onChange={(e) => setForm({ ...form, cityDistrict: e.target.value })}
                        />
                        {errors.cityDistrict && <p className="text-xs text-destructive">{errors.cityDistrict}</p>}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">2. Parent Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Parent Name *</Label>
                        <Input
                          value={form.parentName}
                          onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                        />
                        {errors.parentName && <p className="text-xs text-destructive">{errors.parentName}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label>Parent Occupation *</Label>
                        <Select
                          value={form.parentOccupation}
                          onValueChange={(value) => setForm({ ...form, parentOccupation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                          <SelectContent>
                            {PARENT_OCCUPATION_OPTIONS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.parentOccupation && <p className="text-xs text-destructive">{errors.parentOccupation}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label>Annual Income *</Label>
                        <Select value={form.annualIncome} onValueChange={(value) => setForm({ ...form, annualIncome: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select annual income" />
                          </SelectTrigger>
                          <SelectContent>
                            {ANNUAL_INCOME_OPTIONS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.annualIncome && <p className="text-xs text-destructive">{errors.annualIncome}</p>}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Academic Info</h3>
                    <div className="grid gap-2">
                      <Label>Current Qualification *</Label>
                      <Select
                        value={form.currentQualification}
                        onValueChange={(value) => setForm({ ...form, currentQualification: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENT_QUALIFICATION_OPTIONS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.currentQualification && <p className="text-xs text-destructive">{errors.currentQualification}</p>}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">4. Course Interest</h3>
                    <div className="grid gap-2">
                      <Label>Choose your preferred stream *</Label>
                      <Select value={form.courseInterest} onValueChange={(value) => setForm({ ...form, courseInterest: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course interest" />
                        </SelectTrigger>
                        <SelectContent>
                          {COURSE_INTEREST_OPTIONS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.courseInterest && <p className="text-xs text-destructive">{errors.courseInterest}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label>Are you interested in studying in India or abroad? *</Label>
                      <RadioGroup
                        value={form.studyPreference}
                        onValueChange={(value) => setForm({ ...form, studyPreference: value })}
                        className="gap-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="India" id="study-preference-india" />
                          <Label htmlFor="study-preference-india">India</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Abroad" id="study-preference-abroad" />
                          <Label htmlFor="study-preference-abroad">Abroad</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Exploring Both Options" id="study-preference-both" />
                          <Label htmlFor="study-preference-both">Exploring Both Options</Label>
                        </div>
                      </RadioGroup>
                      {errors.studyPreference && <p className="text-xs text-destructive">{errors.studyPreference}</p>}
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
                    {submitting ? "Submitting..." : "Submit Registration"}
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

export default StudentRegistration;
