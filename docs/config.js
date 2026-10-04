// ─────────────────────────────────────────────────────────────
// 사이트 설정 파일 — README의 2단계, 7단계를 따라 채워 주세요.
//
// 이 파일의 값은 공개되어도 괜찮도록 설계된 값입니다.
// (Firebase 웹 설정값은 "어느 프로젝트에 연결할지"를 알려 주는 주소일 뿐,
//  실제 접근 권한은 firestore.rules / storage.rules 가 서버에서 결정합니다.)
// 비밀번호, 서비스 계정 키(JSON), 메일 앱 비밀번호는 절대 여기에 넣지 마세요.
// ─────────────────────────────────────────────────────────────

// Firebase 콘솔 → 프로젝트 설정 → 일반 → 내 앱(웹) → "SDK 설정 및 구성"의 값을 그대로 붙여 넣으세요.
export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBCu-jSCWGdIIYQ6y3hLS6bsrXLRuk9OLY",
    authDomain: "gaoneway-77753.firebaseapp.com",
    projectId: "gaoneway-77753",
    storageBucket: "gaoneway-77753.firebasestorage.app",
    messagingSenderId: "866599079809",
    appId: "1:866599079809:web:adc6034edd6cdb6287a280",
    measurementId: "G-C0M5MKSH77"
};

// 관리자 계정의 UID 목록 (화면 표시용).
// 실제 권한은 firestore.rules, storage.rules 의 같은 목록이 결정하므로 세 곳을 항상 똑같이 맞춰 주세요.
export const ADMIN_UIDS = ["Yqf87aEWpbYqobL8ThfTvHzXzmT2"];

// 관리자 로그인에 인증 앱(OTP) 코드를 요구할지 여부.
// true 를 권장합니다. false 로 바꾸면 두 rules 파일의 sign_in_second_factor 줄도 함께 지워야 합니다.
export const REQUIRE_MFA = true;

// 인증 앱에 표시될 이름
export const SITE_NAME = "무용가 홈페이지";
