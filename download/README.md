# Download Host Artifacts

`download.vpsttt.com/download/` is a Play-first Android entrypoint. The ordinary
CI APK is signed with the upload key and is not retained/published by the
Play-first workflow. A public APK fallback is allowed only when its signer matches the Play app-signing
certificate exactly.

## Static Page

- `index.html`: Android download entrypoint.
- `styles.css`: responsive visual design.
- `app.js`: reads release metadata.
- `assets/android-chat-preview.png`: mobile UI preview used on the page.
- `privacy.html`: compatibility redirect to canonical `/privacy`.
- `account-deletion.html`: compatibility redirect to canonical `/account-deletion`.

Store listings must use the canonical Next.js routes, not the compatibility
HTML files. Terms, Acceptable Use and Store support are `/terms`,
`/acceptable-use` and `/support`.

## Expected Android Files

After exporting a Play-signed universal APK (or proving the exact same signer),
publish the verified release artifacts under the host path below:

- `android/stable/app-prod-release.apk`
- `android/stable/app-prod-release.apk.sha256`
- `android/stable/mobile-release-manifest.json`

The canonical APK URL is
`https://download.vpsttt.com/downloads/files/android/stable/app-prod-release.apk`.

The manifest must include `signer_sha256` and `play_app_signing_sha256`. The page
keeps the APK action hidden unless both normalize to the same 32-byte digest and
the checksum is valid. Prefer `store_url` for production.

Never upload keystores, `key.properties`, Firebase service account files,
private tester lists, or any secret material to this host.
