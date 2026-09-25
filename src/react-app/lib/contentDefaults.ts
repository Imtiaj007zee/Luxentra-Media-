import { LAUNCH_BUNDLES, BRANDING_PLANS } from "../data/packages";
import { PORTFOLIO } from "../data/portfolio";
import { PHOTOS, NEW_SHOWCASE_ORDER } from "../data/photos";

// ── Single source of truth for every editable default ─────────────────────
// These are the fallbacks the site uses when the Google Sheet tab is empty.
// Copy is NEVER reworded here: defaults match the live site verbatim.

export type CopyEntry = { key: string; group: string; label: string; value: string };

export const DEFAULT_COPY: CopyEntry[] = [
  // ── Navigation ──
  { key: "nav.brand_alt", group: "Navigation", label: "Brand logo alt text", value: "LuxEntra Media" },
  { key: "nav.link_branding", group: "Navigation", label: "Link: Branding", value: "Branding" },
  { key: "nav.link_work", group: "Navigation", label: "Link: Work", value: "Work" },
  { key: "nav.link_about", group: "Navigation", label: "Link: About", value: "About" },
  { key: "nav.cta_book", group: "Navigation", label: "Button: Book a Shoot", value: "Book a Shoot" },
  { key: "nav.menu_aria", group: "Navigation", label: "Mobile menu aria-label", value: "Menu" },
  { key: "nav.home_aria", group: "Navigation", label: "Home link aria-label", value: "LuxEntra Media home" },

  // ── Footer ──
  { key: "footer.tagline", group: "Footer", label: "Tagline", value: "Real estate photography & film. New York City & Long Island." },
  { key: "footer.link_team", group: "Footer", label: "Link: Our team", value: "Our team" },
  { key: "footer.link_book", group: "Footer", label: "Link: Book a shoot", value: "Book a shoot" },
  { key: "footer.link_privacy", group: "Footer", label: "Link: Privacy", value: "Privacy" },
  { key: "footer.fineprint", group: "Footer", label: "Fine print ({{year}} = current year)", value: "© {{year}} LuxEntra Media." },
  { key: "footer.brand_alt", group: "Footer", label: "Brand logo alt text", value: "LuxEntra Media" },
  { key: "footer.home_aria", group: "Footer", label: "Home link aria-label", value: "LuxEntra Media home" },

  // ── Homepage ──
  { key: "home.eyebrow", group: "Homepage", label: "Hero eyebrow", value: "LuxEntra Media · New York" },
  { key: "home.hero_h1a", group: "Homepage", label: "Hero line 1 (motto)", value: "Every listing." },
  { key: "home.hero_h1b", group: "Homepage", label: "Hero line 2 (motto)", value: "A lasting impression." },
  { key: "home.hero_sub1", group: "Homepage", label: "Hero subline 1", value: "Photography, films and personal branding." },
  { key: "home.hero_sub2", group: "Homepage", label: "Hero subline 2", value: "Made for real estate." },
  { key: "home.cta_book", group: "Homepage", label: "Hero button: Book a Shoot", value: "Book a Shoot" },
  { key: "home.cta_work", group: "Homepage", label: "Hero link: Explore the work", value: "Explore the work" },
  { key: "home.picker_eyebrow", group: "Homepage", label: "Service picker eyebrow", value: "Start here" },
  { key: "home.picker_h2", group: "Homepage", label: "Service picker heading", value: "Not sure what you need?" },
  { key: "home.picker_copy", group: "Homepage", label: "Service picker copy", value: "Tell us what brings you here and we will point you to the right service." },
  { key: "home.picker_button", group: "Homepage", label: "Service picker button", value: "Find my service" },
  { key: "home.impact_eyebrow", group: "Homepage", label: "Impact eyebrow", value: "Performance" },
  { key: "home.impact_h2", group: "Homepage", label: "Impact heading", value: "Our Real Estate Impact" },
  { key: "home.impact_intro", group: "Homepage", label: "Impact intro", value: "We shoot homes so they get seen, get remembered, and get sold." },
  { key: "home.metric1_label", group: "Homepage", label: "Metric 1 label", value: "Properties Covered" },
  { key: "home.metric1_desc", group: "Homepage", label: "Metric 1 description", value: "Homes we've shot and marketed so far." },
  { key: "home.metric2_label", group: "Homepage", label: "Metric 2 label", value: "Property Value Covered" },
  { key: "home.metric2_desc", group: "Homepage", label: "Metric 2 description", value: "Combined value of the homes we've covered." },
  { key: "home.metric3_label", group: "Homepage", label: "Metric 3 label", value: "Marketing Success Rate" },
  { key: "home.metric3_desc", group: "Homepage", label: "Metric 3 description", value: "Clients who got the result they wanted." },
  { key: "home.quote_1", group: "Homepage", label: "Pull quote part 1", value: "We make listings people actually" },
  { key: "home.quote_2", group: "Homepage", label: "Pull quote highlight", value: "stop and look at" },
  { key: "home.quote_3", group: "Homepage", label: "Pull quote ending", value: "." },
  { key: "home.stepinside_h2", group: "Homepage", label: "Step inside heading", value: "Step inside." },
  { key: "home.stepinside_copy1", group: "Homepage", label: "Step inside copy 1", value: "A closer look at our featured property." },
  { key: "home.stepinside_copy2", group: "Homepage", label: "Step inside copy 2", value: "From the first approach to the smallest detail." },
  { key: "home.stepinside_note", group: "Homepage", label: "Step inside note", value: "Stills from the featured property." },
  { key: "home.stepinside_link", group: "Homepage", label: "Step inside link", value: "View all work" },
  { key: "home.featured_eyebrow", group: "Homepage", label: "Featured photo eyebrow", value: "Twilight" },
  { key: "home.featured_label", group: "Homepage", label: "Featured photo label", value: "View twilight photos" },
  { key: "home.featured_alt", group: "Homepage", label: "Featured photo alt text", value: "Twilight exterior of a featured property" },
  { key: "home.featured_aria", group: "Homepage", label: "Featured photo aria-label", value: "View twilight photography" },
  { key: "home.still1_caption", group: "Homepage", label: "Still 1 caption", value: "Room to explore." },
  { key: "home.still1_alt", group: "Homepage", label: "Still 1 alt text", value: "Room to explore" },
  { key: "home.still2_caption", group: "Homepage", label: "Still 2 caption", value: "Details worth seeing." },
  { key: "home.still2_alt", group: "Homepage", label: "Still 2 alt text", value: "Details worth seeing" },
  { key: "home.stills_aria", group: "Homepage", label: "Stills aria-label", value: "View interior photography" },
  { key: "home.services_h2a", group: "Homepage", label: "Services heading 1", value: "One creative team." },
  { key: "home.services_h2b", group: "Homepage", label: "Services heading 2", value: "Every angle covered." },
  { key: "home.svc1_label", group: "Homepage", label: "Service 1 label", value: "PHOTOGRAPHY" },
  { key: "home.svc1_title", group: "Homepage", label: "Service 1 title", value: "Make the first look count." },
  { key: "home.svc1_copy", group: "Homepage", label: "Service 1 copy", value: "Interior and exterior photography and twilight imagery. Ready for your listing." },
  { key: "home.svc1_cta", group: "Homepage", label: "Service 1 button", value: "Explore photography" },
  { key: "home.svc2_label", group: "Homepage", label: "Service 2 label", value: "PERSONAL BRANDING" },
  { key: "home.svc2_title", group: "Homepage", label: "Service 2 title", value: "Be the name everyone remembers." },
  { key: "home.svc2_copy", group: "Homepage", label: "Service 2 copy", value: "Your next client will meet your content before they meet you. We turn your expertise and personality into trust, qualified leads, and revenue." },
  { key: "home.svc2_cta", group: "Homepage", label: "Service 2 button", value: "Build my brand" },
  { key: "home.svc3_label", group: "Homepage", label: "Service 3 label", value: "FILM" },
  { key: "home.svc3_title", group: "Homepage", label: "Service 3 title", value: "Give the space a story." },
  { key: "home.svc3_copy", group: "Homepage", label: "Service 3 copy", value: "Walkthrough films and aerial perspectives that show how a property feels and connects." },
  { key: "home.svc3_cta", group: "Homepage", label: "Service 3 button", value: "Watch the film" },
  { key: "home.pkg_h2a", group: "Homepage", label: "Package heading 1", value: "Your next listing." },
  { key: "home.pkg_h2b", group: "Homepage", label: "Package heading 2", value: "Ready to launch." },
  { key: "home.pkg_copy", group: "Homepage", label: "Package intro", value: "The Standard Listing Media Package brings your listing media together in one straightforward booking." },
  { key: "home.pkg_per", group: "Homepage", label: "Package price note", value: "per package" },
  { key: "home.pkg_cta", group: "Homepage", label: "Package button", value: "Build your package" },
  { key: "home.pkg_card_title", group: "Homepage", label: "Package card title", value: "All the essentials. Included." },
  { key: "home.pkg_features", group: "Homepage", label: "Package features (one per line)", value: "25–45 MLS-ready photos\n1 twilight photo\n{{delivery_adjective}}\nPrivate branded gallery\nLight, color & exposure revisions" },
  { key: "home.pkg_fineprint", group: "Homepage", label: "Package fine print", value: "High-resolution and MLS-optimized files. Full usage rights for listing purposes." },
  { key: "home.bundles_eyebrow", group: "Homepage", label: "Bundles eyebrow", value: "Launch packages" },
  { key: "home.bundles_h2a", group: "Homepage", label: "Bundles heading 1", value: "Don't just list it." },
  { key: "home.bundles_h2b", group: "Homepage", label: "Bundles heading 2", value: "Launch it." },
  { key: "home.bundles_intro", group: "Homepage", label: "Bundles intro", value: "Three packages. Pick the level of coverage your listing needs." },
  { key: "home.bundle_starting", group: "Homepage", label: "Bundle price label", value: "Starting at" },
  { key: "home.bundle_cta", group: "Homepage", label: "Bundle button", value: "Choose This Package" },
  { key: "home.custom_h2", group: "Homepage", label: "Custom heading", value: "Need something more custom?" },
  { key: "home.custom_copy", group: "Homepage", label: "Custom copy", value: "Enhance any package with a 3D tour, floor plan, twilight imagery, additional social edits, or expedited delivery.\nTell us about your property, and we'll create the right level of coverage for your listing." },
  { key: "home.custom_cta", group: "Homepage", label: "Custom button", value: "Request a Consultation" },
  { key: "home.addons_h2a", group: "Homepage", label: "Add-ons heading 1", value: "A little more." },
  { key: "home.addons_h2b", group: "Homepage", label: "Add-ons heading 2", value: "A different perspective." },
  { key: "home.addons_copy", group: "Homepage", label: "Add-ons intro", value: "Choose the extras your listing needs.\nSee your total before sending a request." },
  { key: "home.addon_flyer_name", group: "Homepage", label: "Add-on name: flyer", value: "Custom Listing Flyer" },
  { key: "home.addon_staging_name", group: "Homepage", label: "Add-on name: staging", value: "Virtual Staging" },
  { key: "home.addon_drone_name", group: "Homepage", label: "Add-on name: drone", value: "Drone Photos & Video" },
  { key: "home.addon_3d_tour_name", group: "Homepage", label: "Add-on name: 3D tour", value: "3D Virtual Tour" },
  { key: "home.addon_video_name", group: "Homepage", label: "Add-on name: video", value: "Walkthrough/Cinematic Video" },
  { key: "home.addon_reel_name", group: "Homepage", label: "Add-on name: reel", value: "Creative Personal Branding Reel" },
  { key: "home.steps_h2", group: "Homepage", label: "Steps heading", value: "Easy from the start." },
  { key: "home.step1_title", group: "Homepage", label: "Step 1 title", value: "Tell us about the property." },
  { key: "home.step1_copy", group: "Homepage", label: "Step 1 copy", value: "Choose your media and preferred shoot date. We'll get back to you within {{delivery_time}} to confirm the details." },
  { key: "home.step2_title", group: "Homepage", label: "Step 2 title", value: "We take care of the shoot." },
  { key: "home.step2_copy", group: "Homepage", label: "Step 2 copy", value: "Our team captures the space and prepares the photography, films and extras you selected." },
  { key: "home.step3_title", group: "Homepage", label: "Step 3 title", value: "Your media. Ready to share." },
  { key: "home.step3_copy", group: "Homepage", label: "Step 3 copy", value: "Download your files through a private branded gallery, with formats ready for your listing." },
  { key: "home.final_h2", group: "Homepage", label: "Final heading", value: "Let's make your next listing stand out." },
  { key: "home.final_cta1", group: "Homepage", label: "Final button 1", value: "Book a Shoot" },
  { key: "home.final_cta2", group: "Homepage", label: "Final button 2", value: "Meet the team" },
  // ── Booking page ──
  { key: "order.back", group: "Booking page", label: "Back link", value: "Back to home" },
  { key: "order.eyebrow", group: "Booking page", label: "Eyebrow", value: "Book" },
  { key: "order.h1_shoot", group: "Booking page", label: "Heading (shoot)", value: "Book a shoot." },
  { key: "order.h1_consult", group: "Booking page", label: "Heading (consultation)", value: "Book your free consultation." },
  { key: "order.sub", group: "Booking page", label: "Subheading", value: "Three quick steps. No payment today, we confirm by email." },
  { key: "order.step_plan", group: "Booking page", label: "Step label: Plan", value: "Plan" },
  { key: "order.step_addons", group: "Booking page", label: "Step label: Add-ons", value: "Add-ons" },
  { key: "order.step_details", group: "Booking page", label: "Step label: Details", value: "Details" },
  { key: "order.success_title", group: "Booking page", label: "Success title", value: "Thank you!" },
  { key: "order.success_copy", group: "Booking page", label: "Success copy", value: "Your request is in. We'll reach out within {{delivery_time}} to confirm." },
  { key: "order.error_title", group: "Booking page", label: "Error title", value: "Submission error" },
  { key: "order.error_copy", group: "Booking page", label: "Error copy", value: "Please try again or contact {{contact_email}}" },
  { key: "order.summary_no_plan", group: "Booking page", label: "Summary: no plan", value: "No plan selected yet" },
  { key: "order.summary_addons", group: "Booking page", label: "Summary: add-on count", value: "{{n}} add-on(s)" },
  { key: "order.summary_free", group: "Booking page", label: "Summary: free", value: "Free" },
  { key: "order.summary_consult", group: "Booking page", label: "Summary: consultation plan", value: "Free one-on-one consultation" },
  { key: "order.plan_title", group: "Booking page", label: "Plan step title", value: "Choose your plan" },
  { key: "order.plan_sub", group: "Booking page", label: "Plan step sub", value: "Pick one. You can change it any time before you submit." },
  { key: "order.plan_standard_name", group: "Booking page", label: "Standard package name", value: "Standard Listing Media Package" },
  { key: "order.plan_standard_features", group: "Booking page", label: "Standard features (one per line)", value: "25–45 MLS-ready photos\n1 twilight photo\n{{delivery_adjective}}\nPrivate branded gallery\nFree revisions" },
  { key: "order.plan_bundles_title", group: "Booking page", label: "Bundles title", value: "Launch bundles" },
  { key: "order.plan_branding_title", group: "Booking page", label: "Branding title", value: "Personal branding plans" },
  { key: "order.plan_footnote", group: "Booking page", label: "Plan footnote", value: "{{min_commitment}}. Active clients get {{addon_discount}} during their agreement." },
  { key: "order.consult_card_title", group: "Booking page", label: "Consult card title", value: "Not sure yet? Talk to us first." },
  { key: "order.consult_card_copy", group: "Booking page", label: "Consult card copy", value: "Book a free one-on-one. We'll hear your story and find the right direction together, no prep needed." },
  { key: "order.continue", group: "Booking page", label: "Continue button", value: "Continue" },
  { key: "order.select_plan", group: "Booking page", label: "Select-a-plan hint", value: "Select a plan above to continue." },
  { key: "order.addons_title", group: "Booking page", label: "Add-ons title", value: "Make it yours" },
  { key: "order.addons_sub", group: "Booking page", label: "Add-ons sub", value: "Add-ons are optional. Skip ahead whenever you're ready." },
  { key: "order.flyer_note", group: "Booking page", label: "Flyer price note", value: "${{price_addon_flyer}} for 1 · ${{flyer_bulk_price}} each for 2+" },
  { key: "order.reel_note", group: "Booking page", label: "Reel note", value: "Concept, scripting, filming and editing" },
  { key: "order.qty", group: "Booking page", label: "Quantity label", value: "Quantity:" },
  { key: "order.save_badge", group: "Booking page", label: "Bulk savings badge", value: "Save ${{n}} vs full price" },
  { key: "order.staging_name", group: "Booking page", label: "Staging name", value: "Virtual Staging" },
  { key: "order.staging_desc", group: "Booking page", label: "Staging description", value: "Photorealistic digital staging, delivered in 24hrs" },
  { key: "order.staging_tiers", group: "Booking page", label: "Staging tiers (one per line)", value: "1 Room\n3 Rooms\n5 Rooms" },
  { key: "order.back_btn", group: "Booking page", label: "Back button", value: "Back" },
  { key: "order.details_title", group: "Booking page", label: "Details title", value: "Your details" },
  { key: "order.details_sub", group: "Booking page", label: "Details sub", value: "Last step. We'll confirm everything by email within {{delivery_time}}." },
  { key: "order.booking_title", group: "Booking page", label: "Booking summary title", value: "Your booking" },
  { key: "order.row_standard", group: "Booking page", label: "Row: standard", value: "Standard Package" },
  { key: "order.row_bundle_suffix", group: "Booking page", label: "Row: bundle suffix", value: "Bundle" },
  { key: "order.row_plan_suffix", group: "Booking page", label: "Row: plan suffix", value: "· Personal Branding" },
  { key: "order.row_discount", group: "Booking page", label: "Row: discount", value: "Discount ({{code}})" },
  { key: "order.row_total", group: "Booking page", label: "Row: total", value: "Total" },
  { key: "order.change", group: "Booking page", label: "Change link", value: "Change plan or add-ons" },
  { key: "order.label_name", group: "Booking page", label: "Label: name", value: "Name *" },
  { key: "order.ph_name", group: "Booking page", label: "Placeholder: name", value: "John Doe" },
  { key: "order.label_email", group: "Booking page", label: "Label: email", value: "Email *" },
  { key: "order.ph_email", group: "Booking page", label: "Placeholder: email", value: "john@example.com" },
  { key: "order.label_phone", group: "Booking page", label: "Label: phone", value: "Phone (optional)" },
  { key: "order.ph_phone", group: "Booking page", label: "Placeholder: phone", value: "+1 (555) 123-4567" },
  { key: "order.label_borough", group: "Booking page", label: "Label: borough", value: "Borough *" },
  { key: "order.ph_borough", group: "Booking page", label: "Placeholder: borough", value: "Select borough" },
  { key: "order.boroughs", group: "Booking page", label: "Borough options (one per line)", value: "Manhattan\nBrooklyn\nQueens\nBronx\nStaten Island\nLong Island" },
  { key: "order.label_service", group: "Booking page", label: "Label: service type", value: "Service Type *" },
  { key: "order.ph_service", group: "Booking page", label: "Placeholder: service type", value: "Select service type" },
  { key: "order.label_date", group: "Booking page", label: "Label: shoot date", value: "Preferred Shoot Date" },
  { key: "order.label_time", group: "Booking page", label: "Label: shoot time", value: "Preferred Shoot Time" },
  { key: "order.label_address", group: "Booking page", label: "Label: address", value: "Property Address / Location" },
  { key: "order.ph_address", group: "Booking page", label: "Placeholder: address", value: "123 Main St, Brooklyn, NY..." },
  { key: "order.label_details", group: "Booking page", label: "Label: details", value: "Additional Details (optional)" },
  { key: "order.ph_details", group: "Booking page", label: "Placeholder: details", value: "Special requirements, gate codes, anything we should know..." },
  { key: "order.discount_title", group: "Booking page", label: "Discount title", value: "Have a discount code?" },
  { key: "order.discount_copy", group: "Booking page", label: "Discount copy", value: "Have a discount code? Enter it below and we will take it off your total." },
  { key: "order.discount_ph", group: "Booking page", label: "Discount placeholder", value: "Enter your code here" },
  { key: "order.discount_invalid", group: "Booking page", label: "Discount invalid", value: "That code didn't match. Codes are not case sensitive." },
  { key: "order.discount_valid", group: "Booking page", label: "Discount applied", value: "{{code}} applied. ${{amount}} off your booking." },
  { key: "order.submit", group: "Booking page", label: "Submit button", value: "Request booking · {{total}}" },
  { key: "order.sending", group: "Booking page", label: "Submitting…", value: "Sending..." },
  { key: "order.reassurance", group: "Booking page", label: "Reassurance line", value: "No payment today. We confirm every booking by email within {{delivery_time}}." },
  { key: "order.consult_title", group: "Booking page", label: "Consult title", value: "Book your meeting" },
  { key: "order.consult_sub", group: "Booking page", label: "Consult sub", value: "Tell us a little about yourself and we'll set a time to talk." },
  { key: "order.expect_title", group: "Booking page", label: "What-to-expect title", value: "What to expect" },
  { key: "order.expect_bullets", group: "Booking page", label: "What-to-expect bullets (one per line)", value: "We'll hear your story and understand your goals, no prep needed.\nTogether we'll find the right direction for your personal brand.\nIf we genuinely believe we can help, and it feels right for you, we'll build it together.\nIf not, you'll still leave with greater clarity about your next step." },
  { key: "order.label_role", group: "Booking page", label: "Label: what do you do", value: "What do you do? *" },
  { key: "order.ph_role", group: "Booking page", label: "Placeholder: role", value: "Real estate agent, broker, business owner..." },
  { key: "order.label_format", group: "Booking page", label: "Label: meeting format", value: "Preferred meeting format" },
  { key: "order.ph_format", group: "Booking page", label: "Placeholder: format", value: "Select format" },
  { key: "order.format_options", group: "Booking page", label: "Format options (one per line)", value: "Video call\nPhone call\nIn person" },
  { key: "order.label_day", group: "Booking page", label: "Label: preferred day", value: "Preferred day" },
  { key: "order.label_time2", group: "Booking page", label: "Label: preferred time", value: "Preferred time" },
  { key: "order.label_goals", group: "Booking page", label: "Label: goals", value: "What would you like to talk about? (optional)" },
  { key: "order.ph_goals", group: "Booking page", label: "Placeholder: goals", value: "Your goals, what's holding you back, what you'd like clarity on..." },
  { key: "order.consult_submit", group: "Booking page", label: "Consult submit", value: "Request my one-on-one" },
  { key: "order.consult_reassurance", group: "Booking page", label: "Consult reassurance", value: "Free to request. We reply within {{delivery_time}} to set a time." },

  // ── Branding page ──
  { key: "branding.hero_eyebrow", group: "Branding page", label: "Hero eyebrow", value: "Personal Branding \u00b7 Fully Managed" },
  { key: "branding.h1a", group: "Branding page", label: "H1 part 1", value: "Be the name" },
  { key: "branding.h1b", group: "Branding page", label: "H1 accent", value: "everyone" },
  { key: "branding.h1c", group: "Branding page", label: "H1 part 3", value: "remembers." },
  { key: "branding.hero_sub", group: "Branding page", label: "Hero sub", value: "Your next client will meet your content before they meet you. We turn your expertise and personality into trust, qualified leads, and revenue." },
  { key: "branding.hero_films", group: "Branding page", label: "Hero button: films", value: "Watch Our Brand Films" },
  { key: "branding.hero_shift", group: "Branding page", label: "Hero button: shift", value: "See the shift" },
  { key: "branding.hero_packages", group: "Branding page", label: "Hero button: packages", value: "Choose your package" },
  { key: "branding.why_eyebrow", group: "Branding page", label: "Why eyebrow", value: "Why personal brand wins" },
  { key: "branding.why_h2", group: "Branding page", label: "Why heading", value: "The market is becoming people-first." },
  { key: "branding.why_p1", group: "Branding page", label: "Why paragraph 1", value: "Customers don't only compare services anymore. They compare the people behind them." },
  { key: "branding.why_p2", group: "Branding page", label: "Why paragraph 2", value: "In the next two to three years, your personal brand will increasingly determine who gets discovered, trusted, and hired." },
  { key: "branding.why_pull", group: "Branding page", label: "Why pull line", value: "If they don't see you, they'll see your competitor." },
  { key: "branding.shift_eyebrow", group: "Branding page", label: "Shift eyebrow", value: "The shift" },
  { key: "branding.shift_h2", group: "Branding page", label: "Shift heading", value: "Attention has new rules." },
  { key: "branding.shifts", group: "Branding page", label: "Shift pairs (from|to per line)", value: "Company-first|People-first\nRandom posts|Strategic influence\nViews and followers|Leads and sales" },
  { key: "branding.becomes", group: "Branding page", label: "\"becomes\" label (mobile)", value: "becomes" },
  { key: "branding.handle_h2a", group: "Branding page", label: "Handle heading part 1", value: "We handle" },
  { key: "branding.handle_h2b", group: "Branding page", label: "Handle heading accent", value: "everything." },
  { key: "branding.handle_copy", group: "Branding page", label: "Handle copy", value: "Strategy, scripting, filming, editing, posting, platform management, lead funnels, and paid advertising, all connected to one goal:" },
  { key: "branding.handle_goal", group: "Branding page", label: "Handle goal line", value: "Turning attention into clients." },
  { key: "branding.handled", group: "Branding page", label: "Handled services (one per line)", value: "Strategy\nScripting\nFilming\nEditing\nPosting\nPlatform management\nLead funnels\nPaid advertising" },
  { key: "branding.pkg_eyebrow", group: "Branding page", label: "Packages eyebrow", value: "Personal branding packages" },
  { key: "branding.pkg_h2", group: "Branding page", label: "Packages heading", value: "Choose how far you want to take your brand." },
  { key: "branding.pkg_copy", group: "Branding page", label: "Packages copy", value: "Each package is designed for a different stage of growth, from building a consistent presence to generating leads and scaling revenue." },
  { key: "branding.moneyback_note", group: "Branding page", label: "Money-back note", value: "50% money-back if the agreed-upon performance benchmark is not achieved, subject to the campaign terms." },
  { key: "branding.choose", group: "Branding page", label: "\"Choose\" prefix", value: "Choose" },
  { key: "branding.pkg_note", group: "Branding page", label: "Package note ({{min_commitment}}, {{addon_discount}})", value: "{{min_commitment}}. Active clients get {{addon_discount}} off additional services during their agreement." },
  { key: "branding.ads_note", group: "Branding page", label: "Paid-ads footnote", value: "Paid-ad management is included with Growth and Premium. The monthly platform advertising budget will be clearly defined in the client's service agreement." },
  { key: "branding.bc_eyebrow", group: "Branding page", label: "Brand content eyebrow", value: "Brand content" },
  { key: "branding.bc_copy", group: "Branding page", label: "Brand content copy", value: "Already have your brand but need professional content? We'll handle the production and deliver videos ready to post." },
  { key: "branding.bc_note", group: "Branding page", label: "Brand content note", value: "Content production only. Social media management is not included." },
  { key: "branding.start_eyebrow", group: "Branding page", label: "Not-sure eyebrow", value: "Not sure where to start?" },
  { key: "branding.start_h2a", group: "Branding page", label: "Not-sure heading part 1", value: "Let's sit down" },
  { key: "branding.start_h2b", group: "Branding page", label: "Not-sure heading accent", value: "and talk." },
  { key: "branding.start_p1", group: "Branding page", label: "Not-sure paragraph 1", value: "You know your personal brand needs attention. But what to post, how to position yourself, and what will actually bring you clients? That's the hard part to figure out alone." },
  { key: "branding.start_p2", group: "Branding page", label: "Not-sure paragraph 2", value: "Every month your value stays unclear online, the right people scroll right past you." },
  { key: "branding.start_p3", group: "Branding page", label: "Not-sure paragraph 3", value: "So let's meet one-on-one. We'll hear your story, understand your goals, and find the right direction for you. If we genuinely believe we can help, and it feels right for you, we'll build it together. If not, you'll still leave with a clear next step." },
  { key: "branding.start_cta", group: "Branding page", label: "Not-sure button", value: "Let's meet one-on-one" },
  { key: "branding.final_h2a", group: "Branding page", label: "Final CTA line 1", value: "Your competitors are posting." },
  { key: "branding.final_h2b", group: "Branding page", label: "Final CTA line 2", value: "Are you being remembered?" },
  { key: "branding.final_cta", group: "Branding page", label: "Final CTA button", value: "Build my brand" },

  // ── Work page ──
  { key: "work.hero_eyebrow", group: "Work page", label: "Hero eyebrow", value: "Selected work" },
  { key: "work.h1a", group: "Work page", label: "H1 line 1", value: "Proof in" },
  { key: "work.h1b", group: "Work page", label: "H1 line 2", value: "every frame." },
  { key: "work.intro", group: "Work page", label: "Intro", value: "Property films, brand stories, and photography from recent LuxEntra shoots, including the pieces behind our best-performing content." },
  { key: "work.tab_films", group: "Work page", label: "Tab: Films", value: "Films" },
  { key: "work.tab_photos", group: "Work page", label: "Tab: Photos", value: "Photos" },
  { key: "work.filter_all", group: "Work page", label: "Filter: All", value: "All" },
  { key: "work.filter_twilight", group: "Work page", label: "Filter: Twilight", value: "Twilight" },
  { key: "work.filter_aerial", group: "Work page", label: "Filter: Aerial", value: "Aerial" },
  { key: "work.filter_exterior", group: "Work page", label: "Filter: Exterior", value: "Exterior" },
  { key: "work.filter_interior", group: "Work page", label: "Filter: Interior", value: "Interior" },
  { key: "work.filter_staging", group: "Work page", label: "Filter: Staging", value: "Staging" },
  { key: "work.film_groups", group: "Work page", label: "Film groups (one per line)", value: "Listing Films\nPersonal Branding\nBrand Story" },
  { key: "work.showcase_eyebrow", group: "Work page", label: "Showcase eyebrow", value: "Latest shoots" },
  { key: "work.showcase_h2", group: "Work page", label: "Showcase heading", value: "New additions" },
  { key: "work.showcase_count", group: "Work page", label: "Showcase count ({{n}}, {{m}})", value: "{{n}} of {{m}} photos" },
  { key: "work.cta_h2", group: "Work page", label: "CTA heading", value: "Let's make your next listing stand out." },
  { key: "work.cta_book", group: "Work page", label: "CTA button", value: "Book a Shoot" },
  { key: "work.cta_team", group: "Work page", label: "CTA link", value: "Meet the team" },

  // ── About page ──
  { key: "about.hero_eyebrow", group: "About page", label: "Hero eyebrow", value: "Our story" },
  { key: "about.hero_h1", group: "About page", label: "Hero H1", value: "Meet the team." },
  { key: "about.hero_sub", group: "About page", label: "Hero sub", value: "The creative minds behind LuxEntra Media, passionate about elevating every listing through cinematic storytelling." },
  { key: "about.exp_label", group: "About page", label: "Experience badge label", value: "Years Experience" },
  { key: "about.known_as", group: "About page", label: "\"Known as\" prefix", value: "Known as" },
  { key: "about.highlights_title", group: "About page", label: "Highlights title", value: "Key highlights" },
  { key: "about.cta_h2", group: "About page", label: "CTA heading", value: "Ready to work with us?" },
  { key: "about.cta_copy", group: "About page", label: "CTA copy", value: "Let's create stunning media that makes your properties impossible to ignore." },
  { key: "about.cta_button", group: "About page", label: "CTA button", value: "Start your order" },

  // ── Proof section ──
  { key: "proof.eyebrow", group: "Proof section", label: "Eyebrow", value: "Proof" },
  { key: "proof.h2", group: "Proof section", label: "Heading", value: "The numbers speak." },
  { key: "proof.intro", group: "Proof section", label: "Intro", value: "No borrowed reviews, no stock praise. Just the work, counted." },
  { key: "proof.stat1_label", group: "Proof section", label: "Stat 1 label", value: "Properties Covered" },
  { key: "proof.stat1_explainer", group: "Proof section", label: "Stat 1 explainer", value: "Homes across New York City and Long Island, shot and delivered." },
  { key: "proof.stat2_label", group: "Proof section", label: "Stat 2 label", value: "Property Value Covered" },
  { key: "proof.stat2_explainer", group: "Proof section", label: "Stat 2 explainer", value: "The combined value of the listings our media has marketed." },
  { key: "proof.stat3_label", group: "Proof section", label: "Stat 3 label", value: "Marketing Success Rate" },
  { key: "proof.stat3_explainer", group: "Proof section", label: "Stat 3 explainer", value: "Clients who got the result they wanted." },
  { key: "proof.cta_line1", group: "Proof section", label: "CTA line 1", value: "Shot with us before? " },
  { key: "proof.cta_link", group: "Proof section", label: "CTA link text", value: "Send us a few words" },
  { key: "proof.cta_line2", group: "Proof section", label: "CTA line 2", value: " and we will put them right here." },
  { key: "proof.mailto_subject", group: "Proof section", label: "Mailto subject", value: "My words for LuxEntra" },

  // ── FAQ ──
  { key: "faq.eyebrow", group: "FAQ", label: "Eyebrow", value: "Questions" },
  { key: "faq.h2", group: "FAQ", label: "Heading", value: "Questions, answered." },
  { key: "faq.items", group: "FAQ", label: "Items (Q===A blocks, one per line, {{price_*}} tokens work)", value: "How fast do I get my photos?===Within {{delivery_time}} of the shoot. Every package includes {{delivery_adjective}}, and your files land in a private branded gallery, ready for the MLS.\nHow do I book a shoot?===Pick a package on the booking page and tell us about the property. It takes three quick steps and there is no payment today. We confirm every booking by email within {{delivery_time}}.\nWhere do you shoot?===All across {{service_area}}. If your listing is in the five boroughs or out on the island, we come to you.\nWhat is included in the ${{price_standard}} standard package?===25 to 45 MLS-ready photos, one twilight photo, {{delivery_adjective}} delivery, a private branded gallery, and free revisions.\nDo you shoot video too?===Yes, starting with Listing Premiere at ${{price_bundle_listing_premiere}}, which includes a professionally edited cinematic property film. Market Launch at ${{price_bundle_market_launch}} is photography only. Agent Authority at ${{price_bundle_agent_authority}} includes two films, the cinematic property film plus a personal branding video. We also shoot standalone personal branding reels for agents building their name.\nHow do the personal branding plans work?===They are monthly and done for you. Essential is ${{price_branding_essential}} a month, Growth is ${{price_branding_growth}}, and Premium is ${{price_branding_premium}} with a money-back guarantee. Plans start with a 3-month minimum." },
  { key: "faq.outro", group: "FAQ", label: "Outro line", value: "Still not sure? We will point you to the right service." },
  { key: "faq.cta", group: "FAQ", label: "CTA button", value: "Book a free one-on-one" },

  // ── Lead popup ──
  { key: "popup.eyebrow", group: "Lead popup", label: "Eyebrow", value: "First order perk" },
  { key: "popup.title", group: "Lead popup", label: "Title ({{amount}} = public discount)", value: "Realtors, take ${{amount}} off your first booking." },
  { key: "popup.copy", group: "Lead popup", label: "Copy", value: "Drop your details and we will send your code. New clients only." },
  { key: "popup.ph_name", group: "Lead popup", label: "Name placeholder", value: "Your name" },
  { key: "popup.ph_email", group: "Lead popup", label: "Email placeholder", value: "Email" },
  { key: "popup.ph_phone", group: "Lead popup", label: "Phone placeholder", value: "Phone" },
  { key: "popup.ph_brokerage", group: "Lead popup", label: "Brokerage placeholder", value: "Brokerage" },
  { key: "popup.cta", group: "Lead popup", label: "Button", value: "Claim my ${{amount}}" },
  { key: "popup.sending", group: "Lead popup", label: "Button (sending)", value: "Claiming..." },
  { key: "popup.validation_prefix", group: "Lead popup", label: "Validation prefix", value: "Please fill in" },
  { key: "popup.validation_suffix", group: "Lead popup", label: "Validation suffix ({{amount}})", value: "to claim your ${{amount}}." },
  { key: "popup.missing_name", group: "Lead popup", label: "Missing: name", value: "your name" },
  { key: "popup.missing_email", group: "Lead popup", label: "Missing: email", value: "a valid email" },
  { key: "popup.skip", group: "Lead popup", label: "Skip link", value: "No thanks" },
  { key: "popup.success_eyebrow", group: "Lead popup", label: "Success eyebrow", value: "You are in" },
  { key: "popup.success_title", group: "Lead popup", label: "Success title", value: "Your code is ready." },
  { key: "popup.success_copy", group: "Lead popup", label: "Success copy ({{amount}})", value: "Mention this code when you book and ${{amount}} comes off your first order." },
  { key: "popup.success_cta", group: "Lead popup", label: "Success button", value: "Book a shoot" },
  { key: "popup.aria_label", group: "Lead popup", label: "Dialog aria-label", value: "Get $25 off your first order" },

  // ── Service picker ──
  { key: "picker.eyebrow", group: "Service picker", label: "Eyebrow", value: "Welcome to LuxEntra Media" },
  { key: "picker.title", group: "Service picker", label: "Title", value: "How can we help you today?" },
  { key: "picker.sub", group: "Service picker", label: "Subheading", value: "Choose an option, and we'll guide you to the right place." },
  { key: "picker.card1_title", group: "Service picker", label: "Card 1 title", value: "I Want to Market a Property" },
  { key: "picker.card1_cta", group: "Service picker", label: "Card 1 button", value: "Explore Listing Packages" },
  { key: "picker.card2_title", group: "Service picker", label: "Card 2 title", value: "I Want to Build My Personal Brand" },
  { key: "picker.card2_cta", group: "Service picker", label: "Card 2 button", value: "Explore Personal Branding Packages" },
  { key: "picker.card3_title", group: "Service picker", label: "Card 3 title", value: "I Want to Explore Your Work" },
  { key: "picker.card3_cta", group: "Service picker", label: "Card 3 button", value: "Explore Our Work" },
  { key: "picker.card4_title", group: "Service picker", label: "Card 4 title", value: "I\u2019m Not Sure Yet" },
  { key: "picker.card4_cta", group: "Service picker", label: "Card 4 button", value: "Get a Free Consultation" },
  { key: "picker.dismiss", group: "Service picker", label: "Dismiss link", value: "Continue Exploring" },

  // ── Privacy page ──
  { key: "privacy.back", group: "Privacy page", label: "Back link", value: "Back home" },
  { key: "privacy.h1", group: "Privacy page", label: "H1", value: "Privacy Policy" },
  { key: "privacy.updated", group: "Privacy page", label: "Last updated line", value: "LuxEntra Media. Last updated September 19, 2026." },
  { key: "privacy.sections", group: "Privacy page", label: "Sections (Title===Body blocks)", value: "Information we collect===When you book a shoot, request a consultation, or contact us through our forms, we collect the details you provide: your name, email address, phone number, and anything you tell us about your project. We do not collect payment information through the app or website.\nHow we use it===We use your details only to respond to your booking or inquiry, schedule your shoot or consultation, and send you updates about your project. We do not sell your information, and we do not share it with third parties for marketing.\nForm submissions===When you submit a form on this site, your details are sent to our booking system, which stores them in a private Google Sheet through Google Apps Script so our team can follow up. Only authorized members of the LuxEntra Media team can access that data.\nPhotos and videos===Photos and videos we create for you are delivered to you directly. We only publish your content (for example in our portfolio) with your permission.\nData retention===We keep booking inquiries for as long as needed to serve you and meet basic record-keeping needs. You can ask us to delete your details at any time.\nContact us===For any privacy question or deletion request, reach us through the contact form on this site and we will take care of it." },

  // ── 404 page ──
  { key: "notfound.eyebrow", group: "404 page", label: "Eyebrow", value: "LuxEntra Media" },
  { key: "notfound.h1", group: "404 page", label: "H1", value: "404" },
  { key: "notfound.copy", group: "404 page", label: "Copy", value: "This frame didn't make the cut. The page you're looking for doesn't exist or was moved." },
  { key: "notfound.cta", group: "404 page", label: "Button", value: "Back home" },

  // ── SEO ──
  { key: "seo.home_title", group: "SEO", label: "Home title", value: "LuxEntra Media | Real Estate Photography & Film in NYC" },
  { key: "seo.home_desc", group: "SEO", label: "Home description", value: "LuxEntra Media creates cinematic listing films, photography, and personal branding content for real estate professionals in New York City and Long Island." },
  { key: "seo.work_title", group: "SEO", label: "Work title", value: "Our Work | LuxEntra Media" },
  { key: "seo.work_desc", group: "SEO", label: "Work description", value: "Browse LuxEntra Media's portfolio of listing films, brand films, and real estate photography across NYC and Long Island." },
  { key: "seo.about_title", group: "SEO", label: "About title", value: "Meet the Team | LuxEntra Media" },
  { key: "seo.about_desc", group: "SEO", label: "About description", value: "Meet the LuxEntra Media team: photographers, filmmakers, and editors crafting standout real estate marketing in New York." },
  { key: "seo.branding_title", group: "SEO", label: "Branding title", value: "Personal Branding for Agents | LuxEntra Media" },
  { key: "seo.branding_desc", group: "SEO", label: "Branding description", value: "Monthly personal branding plans for real estate agents: cinematic content that turns your expertise into trust, leads, and revenue." },
  { key: "seo.order_title", group: "SEO", label: "Order title", value: "Book a Shoot | LuxEntra Media" },
  { key: "seo.order_desc", group: "SEO", label: "Order description", value: "Book your real estate photography or film package with LuxEntra Media. Choose a package, add extras, and get a confirmation within 24 hours." },
  { key: "seo.privacy_title", group: "SEO", label: "Privacy title", value: "Privacy Policy | LuxEntra Media" },
  { key: "seo.privacy_desc", group: "SEO", label: "Privacy description", value: "How LuxEntra Media collects, uses, and protects your information when you book a shoot or contact us." },
  { key: "seo.fallback_title", group: "SEO", label: "Fallback title", value: "LuxEntra Media" },
  { key: "seo.fallback_desc", group: "SEO", label: "Fallback description", value: "Designed for real estate professionals." },

  // ── Admin login ──
  { key: "admin.login_title", group: "Admin login", label: "Login title", value: "Site Control" },
  { key: "admin.login_sub", group: "Admin login", label: "Login sub", value: "Sign in to manage your website." },
  { key: "admin.label_username", group: "Admin login", label: "Username label", value: "Username" },
  { key: "admin.label_password", group: "Admin login", label: "Password label", value: "Password" },
  { key: "admin.login_btn", group: "Admin login", label: "Sign-in button", value: "Sign In" },
  { key: "admin.login_btn_busy", group: "Admin login", label: "Sign-in button (busy)", value: "Signing in..." },
  { key: "admin.login_error", group: "Admin login", label: "Login error", value: "Invalid username or password." },
  { key: "admin.header_title", group: "Admin login", label: "Header title", value: "Site Control" },
  { key: "admin.header_sub", group: "Admin login", label: "Header sub", value: "Manage everything on your website from here." },
  { key: "admin.saved", group: "Admin login", label: "Saved message", value: "Saved." },
  { key: "admin.save_error", group: "Admin login", label: "Save error", value: "Save failed. Try again." },
  { key: "admin.signout", group: "Admin login", label: "Sign out", value: "Sign out" },
  { key: "order.desc_drone", group: "Booking page", label: "Drone add-on description", value: "Aerial perspectives of the property and neighborhood" },
  { key: "order.desc_3d_tour", group: "Booking page", label: "3D tour add-on description", value: "Interactive walkthrough buyers can explore anytime" },
  { key: "order.desc_video", group: "Booking page", label: "Video add-on description", value: "A cinematic tour of the property" },
];

// ── Team ────────────────────────────────────────────────────────────────
export type TeamMember = {
  id: string;
  name: string;
  knownAs: string;
  role: string;
  title: string;
  photo: string;
  badge: string;
  bio: string;
  highlights: string[];
  quote: string;
  order: number;
  visible: boolean;
};

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "imtiaj",
    name: "Imtiaj Sharker Zishan",
    knownAs: "Zee",
    role: "Founder",
    title: "Founder & Creative Director \u00b7 Photographer & Cinematographer",
    photo: "/Zee2.JPG",
    badge: "8+",
    bio: "Great visuals are not just about how a property looks, they are about how it makes a buyer feel. Imtiaj works closely with every agent to understand the story of each listing and turn it into imagery that feels authentic, intentional, and memorable.\n\nWith eight years behind the camera, he has covered 27 properties in the last six months alone across New York City and Long Island, representing more than $18.3M in listing value. From the first showing to the final closing, he presents every home at its best, with 24-hour delivery and a marketer's eye for what makes buyers stop scrolling. Every project gets the same care, creativity, and purpose.\n\nAs the founder of LuxEntra Media, his goal is simple: to give every listing a lasting impression.",
    highlights: [
      "8+ Years of Photography & Cinematography Experience",
      "Commercial, Corporate & Real Estate Productions",
      "27+ Real Estate Properties Covered",
      "Professional Headshots & Personal Branding",
      "Institutional, Celebrity & High-Profile Event Experience",
    ],
    quote: "Your vision. Your story. Brought to life with purpose in every frame.",
    order: 1,
    visible: true,
  },
  {
    id: "asgar",
    name: "Asgar Hossain Mahmud",
    knownAs: "",
    role: "Founder",
    title: "Managing Director \u00b7 Visual Storyteller",
    photo: "/Asgar.JPG",
    badge: "4+",
    bio: "A creative professional with 4+ years of experience, Asgar specializes in managing productions and crafting visual stories through landscapes and portraits. With a strong background in event and shoot management, he has worked closely with production teams to ensure smooth execution from planning to final delivery.\n\nHis work combines organizational precision with a natural eye for color, composition, and storytelling, bringing both structure and creativity to every project.",
    highlights: [
      "4+ Years of Experience in Production & Event Management",
      "Founder & Managing Director Experience",
      "Expertise in Shoot Coordination & On-Set Management",
      "Strong Visual Storytelling in Landscape & Portrait Work",
      "Skilled in Color, Composition, and Creative Direction",
    ],
    quote: "Where vision meets execution.",
    order: 2,
    visible: true,
  },
  {
    id: "shamim",
    name: "Shamim Mridha",
    knownAs: "",
    role: "Creative Head",
    title: "Creative Head \u00b7 Motion Designer \u00b7 Video Editor \u00b7 VFX Artist",
    photo: "/Shamim.JPG",
    badge: "6+",
    bio: "A creative visual specialist with 6+ years of industry experience, Shamim transforms ideas into bold, audience-focused content designed to capture attention and drive action. His expertise spans motion design, video editing, visual effects, graphic design, and brand-focused storytelling.\n\nAs Creative Head at LuxEntra Media, Shamim leads the visual direction behind each project, combining creativity with commercial strategy. His approach ensures that every visual not only looks polished but also communicates clearly, strengthens the brand, and supports meaningful business growth.",
    highlights: [
      "6+ Years of Creative Industry Experience",
      "Motion Design, Video Editing & Visual Effects",
      "Graphic Design for Social Media and Digital Campaigns",
      "Branding, Logos, Covers & Promotional Visuals",
      "Conversion-Focused Visual Storytelling",
    ],
    quote: "Turning bold ideas into visuals that capture attention, inspire action, and convert.",
    order: 3,
    visible: true,
  },
  {
    id: "neero",
    name: "Shamrat Neero",
    knownAs: "",
    role: "Creative Director",
    title: "Commercial Director \u00b7 FPV Drone Pilot \u00b7 DOP",
    photo: "/Neero.JPG",
    badge: "8+",
    bio: "A cinematic filmmaker with over 8 years of experience in visual storytelling and commercial production. Shamrat has collaborated with 30+ national and international brands, blending creativity, motion, and precision to craft immersive visual experiences.",
    highlights: [
      "30+ Brand Collaborations (Netflix, DJI, Sony, Tilta)",
      "8+ Years in Cinematic & Commercial Production",
      "Specialized in FPV Drone & Dynamic Camera Work",
      "Expertise in Storytelling, Color, and Visual Direction",
    ],
    quote: "We don't just capture visuals, we create cinematic experiences.",
    order: 4,
    visible: true,
  },
];

// ── Packages ────────────────────────────────────────────────────────────
// Editable marketing content for launch bundles + branding plans.
// Prices still come from Site Settings; these rows control names, copy,
// feature lists, badges, order and visibility.
export type PackageContent = {
  id: string;
  kind: "bundle" | "plan";
  name: string;
  tagline: string;
  blurb: string;
  features: string[];
  badge: string;
  featured: boolean;
  order: number;
  visible: boolean;
};

export const DEFAULT_PACKAGES: PackageContent[] = [
  ...LAUNCH_BUNDLES.map((b, i) => ({
    id: b.id,
    kind: "bundle" as const,
    name: b.name,
    tagline: "",
    blurb: b.blurb,
    features: [...b.features],
    badge: b.badge ?? "",
    featured: !!b.featured,
    order: i + 1,
    visible: true,
  })),
  ...BRANDING_PLANS.map((p, i) => ({
    id: p.id,
    kind: "plan" as const,
    name: p.name,
    tagline: p.tagline,
    blurb: p.desc,
    features: [...p.features],
    badge: p.badge ?? "",
    featured: !!p.featured,
    order: i + 1,
    visible: true,
  })),
];

// ── Portfolio films ─────────────────────────────────────────────────────
export type FilmContent = {
  id: string;
  title: string;
  category: string;
  poster: string;
  video: string;
  ratio: "landscape" | "portrait";
  order: number;
  visible: boolean;
  url_override: string;
};

export const DEFAULT_FILMS: FilmContent[] = PORTFOLIO.map((f, i) => ({
  id: f.slug,
  title: f.title,
  category: f.category,
  poster: f.poster,
  video: f.src,
  ratio: f.ratio,
  order: i + 1,
  visible: true,
  url_override: "",
}));

// ── Portfolio photos ────────────────────────────────────────────────────
// showcase > 0 marks membership in the "Fresh from the field" showcase,
// sorted by that number. url_override swaps the bundled file for a link.
export type PhotoContent = {
  slug: string;
  title: string;
  label: string;
  filter: string;
  showcase: number;
  order: number;
  visible: boolean;
  url_override: string;
};

const SHOWCASE_RANK = new Map(NEW_SHOWCASE_ORDER.map((s, i) => [s, i + 1]));

export const DEFAULT_PHOTOS: PhotoContent[] = PHOTOS.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  label: p.label,
  filter: p.filter,
  showcase: SHOWCASE_RANK.get(p.slug) ?? 0,
  order: i + 1,
  visible: true,
  url_override: "",
}));

// ── Numbers & terms ─────────────────────────────────────────────────────
export type TermEntry = { key: string; label: string; value: string };

export const DEFAULT_TERMS: TermEntry[] = [
  { key: "site_url", label: "Canonical site URL", value: "https://www.luxentramedia.com" },
  { key: "contact_email", label: "Contact email", value: "luxentra.media@gmail.com" },
  { key: "contact_phone", label: "Contact phone", value: "+1 (347) 837-1257" },
  { key: "service_area", label: "Service area", value: "New York City & Long Island" },
  { key: "delivery_time", label: "Delivery time", value: "24 hours" },
  { key: "delivery_adjective", label: "Delivery adjective", value: "24-hour delivery" },
  { key: "flyer_bulk_price", label: "Bulk flyer price (each, for 2+)", value: "35" },
  { key: "featured_photo", label: "Homepage featured twilight photo", value: "/work/photos/new-twilight-4.jpg" },
  { key: "still_1", label: "Homepage still 1", value: "/stills/still-1.jpg" },
  { key: "still_2", label: "Homepage still 2", value: "/stills/still-2.jpg" },
  { key: "og_image", label: "Social share image path", value: "/og-image.jpg" },
  { key: "min_commitment", label: "Branding minimum commitment", value: "3-month minimum commitment" },
  { key: "addon_discount", label: "Add-on discount for branding clients", value: "15%" },
];

// ── Discount codes ──────────────────────────────────────────────────────
// Never shown publicly except ones flagged public.
export type DiscountEntry = { code: string; amount: number; active: boolean; public: boolean };

export const DEFAULT_DISCOUNTS: DiscountEntry[] = [
  { code: "WELCOME25", amount: 25, active: true, public: true },
  { code: "LUX50", amount: 50, active: true, public: false },
  { code: "ENTRA99", amount: 99, active: true, public: false },
  { code: "LUX75", amount: 75, active: true, public: false },
];
