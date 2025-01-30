import { cookies as nextCookies } from "next/headers";

import { DevDisclaimerBannerInner } from "@/components/ui/DevDisclaimerBanner/inner";

export async function DevDisclaimerBanner() {
    const cookies = await nextCookies();

    if (cookies.has("atcast-dev-disclaimer-dismissed")) {
        return null;
    }

    return <DevDisclaimerBannerInner />;
}
