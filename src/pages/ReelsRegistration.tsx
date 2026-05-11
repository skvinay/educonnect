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
import {
  INFLUENCER_AVG_REEL_VIEWS,
  INFLUENCER_FOLLOWERS_RANGES,
  INFLUENCER_POSTING_TIMELINE,
} from "@/data/registrationFormOptions";
import { getUtmParams, submitRegistration } from "@/lib/registration";

type InfluencerForm = {
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  instagramUsername: string;
  instagramProfileLink: string;
  followersRange: string;
  otherPlatforms: string[];
  isPublicAccount: string;
  averageReelViews: string;
  contentCategories: string[];
  promotedBrandsBefore: string;
  promotedBrandsDetails: string;
  collaborationExpectations: string;
  postingTimeline: string;
  visitingExpo: string;
  honeypot: string;
};

const OTHER_PLATFORMS = ["YouTube", "Facebook", "Snapchat"] as const;
const CONTENT_CATEGORIES = [
  "Education",
  "Lifestyle",
  "Comedy",
  "Motivation",
  "Fashion",
  "Travel",
  "Tech",
  "Other",
] as const;
const YES_NO = ["Yes", "No"] as const;
const VISITING_OPTIONS = ["Yes", "No", "Maybe"] as const;

const ReelsRegistration = () => {
  const location = useLocation();
  const utm = useMemo(() => getUtmParams(location.search), [location.search]);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<InfluencerForm>({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    instagramUsername: "",
    instagramProfileLink: "",
    followersRange: "",
    otherPlatforms: [],
    isPublicAccount: "",
    averageReelViews: "",
    contentCategories: [],
    promotedBrandsBefore: "",
    promotedBrandsDetails: "",
    collaborationExpectations: "",
    postingTimeline: "",
    visitingExpo: "",
    honeypot: "",
  });

  const toggleMulti = (key: "otherPlatforms" | "contentCategories", value: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((item) => item !== value),
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.fullName.trim()) next.fullName = "Full Name is required";
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = "Mobile must be exactly 10 digits";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid Email";
    if (!form.city.trim()) next.city = "City is required";

    if (!form.instagramUsername.trim()) next.instagramUsername = "Instagram Username is required";
    if (!form.instagramProfileLink.trim()) next.instagramProfileLink = "Instagram Profile Link is required";
    if (!form.followersRange) next.followersRange = "Please select Followers range";
    if (!form.isPublicAccount) next.isPublicAccount = "Please select account visibility";
    if (!form.averageReelViews) next.averageReelViews = "Please select Average Reel Views";

    if (form.contentCategories.length === 0) next.contentCategories = "Select at least one Content Category";
    if (!form.promotedBrandsBefore) next.promotedBrandsBefore = "Please select Yes/No";
    if (!form.postingTimeline) next.postingTimeline = "Please select Posting Timeline";
    if (!form.visitingExpo) next.visitingExpo = "Please select Event Intent";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await submitRegistration({
        form_type: "influencer",
        timestamp: new Date().toISOString(),
        full_name: form.fullName,
        mobile_number: form.mobile,
        email_id: form.email,
        city: form.city,
        instagram_username: form.instagramUsername,
        instagram_profile_link: form.instagramProfileLink,
        followers_range: form.followersRange,
        other_platforms: form.otherPlatforms,
        is_account_public: form.isPublicAccount,
        average_reel_views: form.averageReelViews,
        content_category: form.contentCategories,
        promoted_brands_before: form.promotedBrandsBefore,
        promoted_brands_details: form.promotedBrandsBefore === "Yes" ? form.promotedBrandsDetails : "",
        collaboration_expectations: form.collaborationExpectations,
        posting_timeline: form.postingTimeline,
        visiting_expo: form.visitingExpo,
        honeypot: form.honeypot,
        utm,
      });

      setForm({
        fullName: "",
        mobile: "",
        email: "",
        city: "",
        instagramUsername: "",
        instagramProfileLink: "",
        followersRange: "",
        otherPlatforms: [],
        isPublicAccount: "",
        averageReelViews: "",
        contentCategories: [],
        promotedBrandsBefore: "",
        promotedBrandsDetails: "",
        collaborationExpectations: "",
        postingTimeline: "",
        visitingExpo: "",
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
        <PreFormSections sections={registrationContent.reels} />

        <div className="mx-auto max-w-3xl">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Influencer Registration Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <div className="rounded-xl border border-orange-300 bg-orange-50 p-6 text-center">
                  <h3 className="text-xl font-semibold text-orange-700">Entry Submitted ✅</h3>
                  <p className="mt-2 text-sm text-orange-700">Your form has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Basic Info</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Full Name *</Label>
                        <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Mobile *</Label>
                        <Input
                          inputMode="numeric"
                          maxLength={10}
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
                        />
                        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Email *</Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <Label>City *</Label>
                        <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">2. Social Media</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Instagram Username *</Label>
                        <Input
                          value={form.instagramUsername}
                          onChange={(e) => setForm({ ...form, instagramUsername: e.target.value })}
                        />
                        {errors.instagramUsername && <p className="text-xs text-destructive">{errors.instagramUsername}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Instagram Profile Link *</Label>
                        <Input
                          value={form.instagramProfileLink}
                          onChange={(e) => setForm({ ...form, instagramProfileLink: e.target.value })}
                        />
                        {errors.instagramProfileLink && (
                          <p className="text-xs text-destructive">{errors.instagramProfileLink}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label>Followers *</Label>
                        <Select value={form.followersRange} onValueChange={(value) => setForm({ ...form, followersRange: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {INFLUENCER_FOLLOWERS_RANGES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.followersRange && <p className="text-xs text-destructive">{errors.followersRange}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Average Reel Views *</Label>
                        <Select
                          value={form.averageReelViews}
                          onValueChange={(value) => setForm({ ...form, averageReelViews: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {INFLUENCER_AVG_REEL_VIEWS.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.averageReelViews && <p className="text-xs text-destructive">{errors.averageReelViews}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Is account public? *</Label>
                        <Select
                          value={form.isPublicAccount}
                          onValueChange={(value) => setForm({ ...form, isPublicAccount: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {YES_NO.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.isPublicAccount && <p className="text-xs text-destructive">{errors.isPublicAccount}</p>}
                      </div>
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Other Platforms</Label>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {OTHER_PLATFORMS.map((platform) => (
                            <label key={platform} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                              <Checkbox
                                checked={form.otherPlatforms.includes(platform)}
                                onCheckedChange={(checked) => toggleMulti("otherPlatforms", platform, !!checked)}
                              />
                              {platform}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Content Category</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {CONTENT_CATEGORIES.map((category) => (
                        <label key={category} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                          <Checkbox
                            checked={form.contentCategories.includes(category)}
                            onCheckedChange={(checked) => toggleMulti("contentCategories", category, !!checked)}
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                    {errors.contentCategories && <p className="text-xs text-destructive">{errors.contentCategories}</p>}
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">4. Experience</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Promoted brands before? *</Label>
                        <Select
                          value={form.promotedBrandsBefore}
                          onValueChange={(value) => setForm({ ...form, promotedBrandsBefore: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {YES_NO.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.promotedBrandsBefore && (
                          <p className="text-xs text-destructive">{errors.promotedBrandsBefore}</p>
                        )}
                      </div>
                      {form.promotedBrandsBefore === "Yes" && (
                        <div className="grid gap-2">
                          <Label>If yes, share details</Label>
                          <Textarea
                            value={form.promotedBrandsDetails}
                            onChange={(e) => setForm({ ...form, promotedBrandsDetails: e.target.value })}
                          />
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label>Collaboration expectations (optional)</Label>
                        <Textarea
                          value={form.collaborationExpectations}
                          onChange={(e) => setForm({ ...form, collaborationExpectations: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">5. Posting Commitment</h3>
                    <div className="grid gap-2">
                      <Label>Timeline *</Label>
                      <Select
                        value={form.postingTimeline}
                        onValueChange={(value) => setForm({ ...form, postingTimeline: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {INFLUENCER_POSTING_TIMELINE.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.postingTimeline && <p className="text-xs text-destructive">{errors.postingTimeline}</p>}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">6. Event Intent</h3>
                    <div className="grid gap-2">
                      <Label>Visiting Expo? *</Label>
                      <Select value={form.visitingExpo} onValueChange={(value) => setForm({ ...form, visitingExpo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {VISITING_OPTIONS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.visitingExpo && <p className="text-xs text-destructive">{errors.visitingExpo}</p>}
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
                    {submitting ? "Submitting..." : "Submit Entry"}
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

export default ReelsRegistration;
