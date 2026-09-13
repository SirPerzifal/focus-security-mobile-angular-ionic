import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, of, catchError } from 'rxjs';
import { ApiService } from '../api.service';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from 'jwt-decode';

export interface TermsConditionsData {
  enabled: boolean;
  html: string;
  version: string;
  company_code: string;
  title: string;
  needs_acceptance: boolean;
}

export const DEFAULT_TNC_HTML = `<h2>iFS360 App – Terms and Conditions of Use</h2>
<p><strong>Effective Date:</strong> 01/08/2026<br>
<strong>Version:</strong> FS0001</p>

<p>These Terms and Conditions of Use ("Terms") govern your access to and use of the <strong>iFS360 App</strong> ("App") provided by <strong>Focus Security Services Pte Ltd</strong> ("Focus Security", "we", "us" or "our").</p>

<p>By registering for, accessing or using the iFS360 App, or by selecting "I Agree", "Accept" or an equivalent button, you confirm that you have read, understood and agreed to these Terms.</p>

<p>If you do not agree to these Terms, you must not access or use the iFS360 App.</p>

<h3>1. Purpose and Scope</h3>
<p>The iFS360 App is a digital platform that may provide users with services and functions such as:</p>
<ul>
  <li>Visitor and access management;</li>
  <li>Invitations and visitor registration;</li>
  <li>Facility or amenity-related services;</li>
  <li>Security and incident reporting;</li>
  <li>Door Access/Gate controls;</li>
  <li>Notifications and communications;</li>
  <li>Requests, submissions and service updates; and</li>
  <li>Other functions made available by Focus Security or the relevant client, property management or authorised organisation.</li>
</ul>
<p>The features available to you may depend on your user role, property, organisation, subscription, permissions and other access controls.</p>

<h3>2. Eligibility and Authorised Use</h3>
<p>You may use the iFS360 App only if you are authorised to do so by Focus Security, a client, property management organisation, employer or other authorised organisation.</p>
<p>You must:</p>
<ul>
  <li>Provide accurate and up-to-date information where required;</li>
  <li>Use the iFS360 App only for its intended and authorised purposes;</li>
  <li>Comply with applicable laws, regulations, property rules and reasonable instructions relating to your use of the iFS360 App; and</li>
  <li>Use only the functions and information for which you have been authorised.</li>
</ul>
<p>You must not allow another person to use your account unless the iFS360 App expressly provides a feature allowing such access.</p>

<h3>3. Account and Login Security</h3>
<p>Your account and login credentials are intended for your individual use.</p>
<p>You are responsible for:</p>
<ul>
  <li>Keeping your login credentials, authentication codes and other access information confidential;</li>
  <li>Taking reasonable steps to prevent unauthorised access to your account or device;</li>
  <li>Immediately notifying the appropriate support or management channel if you believe your account has been compromised; and</li>
  <li>Ensuring that information submitted through your account is accurate and not misleading.</li>
</ul>
<p>You must not attempt to obtain, use or share another person's account or credentials without authorisation.</p>

<h3>4. Acceptable Use</h3>
<p>You must use the iFS360 App responsibly and must not:</p>
<ul>
  <li>Submit false, misleading, fraudulent or deliberately inaccurate information;</li>
  <li>Make false or malicious reports;</li>
  <li>Harass, threaten, abuse or impersonate another person;</li>
  <li>Use the iFS360 App to conduct unlawful activities;</li>
  <li>Attempt to gain unauthorised access to another user's account, restricted function, system or data;</li>
  <li>Circumvent or interfere with security or access controls;</li>
  <li>Introduce malicious software, code or other harmful material;</li>
  <li>Reverse engineer, decompile or attempt to extract the source code of the iFS360 App except where permitted by applicable law;</li>
  <li>Scrape, copy, extract or systematically collect information from the iFS360 App without authorisation; or</li>
  <li>Use the iFS360 App in a manner that may disrupt, damage or adversely affect the iFS360 App or other users.</li>
</ul>

<h3>5. Information and Submissions</h3>
<p>Where the iFS360 App allows you to submit information, photographs, documents, reports, comments or other content ("User Content"), you are responsible for ensuring that the information you submit is lawful, accurate and appropriate for the relevant purpose.</p>
<p>You must not submit information belonging to another person unless you are authorised to do so.</p>
<p>You grant Focus Security and the relevant authorised organisation permission to use User Content for the purposes of providing, administering, investigating and improving the relevant services, and for other purposes permitted by applicable law and the applicable Privacy Policy.</p>

<h3>6. Location, Camera and Other Device Permissions</h3>
<p>Certain iFS360 App functions may require access to device features such as:</p>
<ul>
  <li>Location services;</li>
  <li>Camera;</li>
  <li>Photos or files;</li>
  <li>Notifications; or</li>
  <li>Other device permissions.</li>
</ul>
<p>You may be asked to grant these permissions when using the relevant functions.</p>
<p>If you refuse or disable a required permission, some iFS360 App functions may not be available or may not operate correctly.</p>
<p>Location information, photographs and other personal data will be handled in accordance with the applicable Privacy Policy.</p>

<h3>7. Personal Data and Privacy</h3>
<p>Your use of the iFS360 App may involve the collection, use and disclosure of personal data.</p>
<p>Focus Security will handle personal data in accordance with its applicable Privacy Policy, which explains:</p>
<ul>
  <li>The types of personal data that may be collected;</li>
  <li>The purposes for which personal data may be collected, used or disclosed;</li>
  <li>How personal data is protected and retained;</li>
  <li>Your rights and available processes relating to access, correction and withdrawal of consent; and</li>
  <li>How to contact the Data Protection Officer.</li>
</ul>
<p>The Privacy Policy forms part of the terms governing your use of the iFS360 to the extent applicable.</p>

<h3>8. Third-Party Services and Information</h3>
<p>The iFS360 App may interact with third-party services, systems, devices or platforms required to provide certain functions.</p>
<p>Where third-party services are used, their availability may depend on the relevant third party. Focus Security is not responsible for failures caused solely by third-party systems that are outside Focus Security's reasonable control.</p>

<h3>9. App Availability and Changes</h3>
<p>We will use reasonable efforts to keep the iFS360 App available and functioning properly.</p>
<p>However, the iFS360 App may occasionally be unavailable or interrupted because of:</p>
<ul>
  <li>Maintenance or upgrades;</li>
  <li>Network or telecommunications problems;</li>
  <li>Software, Device or operating system issues;</li>
  <li>Third-party service failures; or</li>
  <li>Circumstances beyond our reasonable control.</li>
</ul>
<p>We may modify, suspend or discontinue any iFS360 App feature where reasonably necessary for security, maintenance, operational, legal or business reasons.</p>

<h3>10. Security and System Integrity</h3>
<p>You must not interfere with the security, operation or integrity of the iFS360 App.</p>
<p>Any suspected security issue, unauthorised access, account compromise, loss of a device containing iFS360 App access, or other security incident should be reported promptly through the official support or management channel made available to you.</p>

<h3>11. Intellectual Property</h3>
<p>The iFS360 App, including its software, design, interface, branding, documentation and other materials provided by Focus Security, is owned by or licensed to Focus Security and is protected by applicable intellectual property laws.</p>
<p>Except as permitted by these Terms or applicable law, you must not copy, modify, distribute, reproduce, sell, lease, sublicense or commercially exploit any part of the iFS360 App.</p>

<h3>12. Suspension or Termination</h3>
<p>Access to the iFS360 App may be suspended, restricted or terminated if:</p>
<ul>
  <li>You breach these Terms;</li>
  <li>Your authorisation to use the iFS360 App ends;</li>
  <li>Your relationship with the relevant client, property, organisation or service ends;</li>
  <li>Your account presents a security or operational risk;</li>
  <li>Access is required to be suspended by law or a competent authority; or</li>
  <li>Suspension or termination is reasonably necessary to protect the iFS360 App, its users or the relevant organisation.</li>
</ul>
<p>Where reasonably practicable, we may provide notice before suspension or termination. Immediate suspension may be applied where necessary to address security, fraud, misuse or other serious risks.</p>

<h3>13. Disclaimer and Limitation of Liability</h3>
<p>The iFS360 App is provided as a technology platform to support the relevant services and operations. Unless expressly stated otherwise, Focus Security does not guarantee that the iFS360 App will always be uninterrupted, error-free or available at all times.</p>
<p>To the extent permitted by applicable law, Focus Security will not be responsible for loss or damage caused solely by circumstances outside its reasonable control, including failures of telecommunications networks, third-party services, user devices or systems.</p>
<p>Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited under Singapore law.</p>

<h3>14. Changes to These Terms</h3>
<p>We may update these Terms from time to time where necessary to reflect changes to the iFS360 App, our services, applicable laws or operational requirements.</p>
<p>The latest version of these Terms will be made available through the iFS360 App. Where a material change is made, you may be required to review and accept the updated Terms before continuing to use the iFS360 App.</p>

<h3>15. Governing Law</h3>
<p>These Terms are governed by the laws of Singapore.</p>
<p>Any dispute arising out of or in connection with these Terms shall be subject to the jurisdiction of the courts of Singapore.</p>

<h3>16. Contact</h3>
<p>For questions regarding these Terms or the iFS360 App, please contact:</p>
<p><strong>Focus Security Services Pte Ltd</strong><br>
Email: <a href="mailto:digital@ifs360-sg.com">digital@ifs360-sg.com</a></p>
<p>For personal data protection matters, please refer to the contact details provided in the applicable Privacy Policy.</p>

<h3>17. Acceptance</h3>
<p>By selecting "I Agree" or "Accept", you confirm that:</p>
<ul>
  <li>You have read and understood these Terms;</li>
  <li>You agree to comply with these Terms;</li>
  <li>You are authorised to use the iFS360 App; and</li>
  <li>You acknowledge that your use of the iFS360 App is also subject to the applicable Privacy Policy.</li>
</ul>
<p>Your electronic acceptance may be recorded together with relevant account and acceptance information for the purpose of demonstrating your acceptance of these Terms.</p>`;

export const DEFAULT_TNC_VERSION = 'FS0001_20260801';

@Injectable({
  providedIn: 'root',
})
export class TermsConditionsService extends ApiService {
  private readonly noLoadingHeader = { headers: new HttpHeaders({ 'X-No-Loading': 'true' }) };

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Fetch terms and conditions from backend, falling back to embedded PDF content if needed.
   */
  fetchTerms(): Observable<TermsConditionsData> {
    return this.http
      .get<any>(`${this.baseUrl}/api/terms_and_conditions`, this.noLoadingHeader)
      .pipe(
        map((res) => {
          const data = res?.data || res?.result?.data;
          if (data && data.html) {
            return data as TermsConditionsData;
          }
          return this.getDefaultTermsData();
        }),
        catchError(() => of(this.getDefaultTermsData()))
      );
  }

  /**
   * Accept the current terms and conditions.
   */
  acceptTerms(version?: string): Observable<{ accepted: boolean; version: string; needs_acceptance: boolean }> {
    const targetVersion = version || DEFAULT_TNC_VERSION;
    return this.http
      .post<any>(`${this.baseUrl}/api/terms_and_conditions/accept`, {}, this.noLoadingHeader)
      .pipe(
        map((res) => {
          const data = res?.data || res?.result?.data || { accepted: true, version: targetVersion, needs_acceptance: false };
          this.saveAcceptedVersion(data.version || targetVersion);
          return data;
        }),
        catchError(() => {
          this.saveAcceptedVersion(targetVersion);
          return of({ accepted: true, version: targetVersion, needs_acceptance: false });
        })
      );
  }

  /**
   * Determine if the terms must be accepted.
   * Explicitly returns false for VMS users!
   */
  async needsAcceptance(terms: TermsConditionsData): Promise<boolean> {
    const isVmsUser = await this.isVmsUser();
    if (isVmsUser) {
      return false; // VMS never shows terms
    }

    if (!terms?.enabled || !terms.html?.trim()) {
      return false;
    }

    // Check local preferences cache
    const acceptedVersion = await this.getAcceptedVersion();
    if (acceptedVersion && acceptedVersion === terms.version) {
      return false;
    }

    return !!terms.needs_acceptance;
  }

  /**
   * Check if current authenticated user is a VMS user.
   */
  async isVmsUser(): Promise<boolean> {
    try {
      const tokenData = await Preferences.get({ key: 'USER_INFO' });
      if (!tokenData?.value) {
        return false;
      }
      let rawToken = tokenData.value;
      try {
        const decodedString = decodeURIComponent(escape(atob(rawToken)));
        const credential = JSON.parse(decodedString);
        if (credential?.access_token) {
          rawToken = credential.access_token;
        }
      } catch {
        // rawToken is JWT string
      }
      const decoded: any = jwtDecode(rawToken);
      return !!decoded?.is_vms;
    } catch {
      return false;
    }
  }

  /**
   * Check if current authenticated user is a Resident or Client.
   */
  async isResidentOrClientUser(): Promise<boolean> {
    try {
      const tokenData = await Preferences.get({ key: 'USER_INFO' });
      if (!tokenData?.value) {
        return false;
      }
      let rawToken = tokenData.value;
      try {
        const decodedString = decodeURIComponent(escape(atob(rawToken)));
        const credential = JSON.parse(decodedString);
        if (credential?.access_token) {
          rawToken = credential.access_token;
        }
      } catch {
        // rawToken is JWT string
      }
      const decoded: any = jwtDecode(rawToken);
      if (decoded?.is_vms) {
        return false;
      }
      return !!(decoded?.is_client || decoded?.is_resident || decoded?.family_id || decoded?.user_id);
    } catch {
      return false;
    }
  }

  async saveAcceptedVersion(version: string): Promise<void> {
    await Preferences.set({
      key: 'ACCEPTED_TERMS_VERSION',
      value: version,
    });
  }

  async getAcceptedVersion(): Promise<string | null> {
    const res = await Preferences.get({ key: 'ACCEPTED_TERMS_VERSION' });
    return res?.value || null;
  }

  getDefaultTermsData(): TermsConditionsData {
    return {
      enabled: true,
      html: DEFAULT_TNC_HTML,
      version: DEFAULT_TNC_VERSION,
      company_code: 'FOCUS',
      title: 'Terms & Conditions of Use',
      needs_acceptance: true,
    };
  }
}
