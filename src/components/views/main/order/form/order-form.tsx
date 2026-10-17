"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { WebsiteTypeSection, WebsiteType } from "./section/website-type";
import { OrderDetailForm } from "./section/order-detail-form";

export default function OrderForm() {
  const searchParams = useSearchParams();

  const packageId = searchParams.get("packageId") || "";
  const packageName = searchParams.get("packageName") || "";

  const [step, setStep] = useState(1);
  const [selectedWebsiteType, setSelectedWebsiteType] =
    useState<WebsiteType | null>(null);

  return (
    <div className="mx-auto max-w-5xl">
      {step === 1 && (
        <WebsiteTypeSection
          packageId={packageId}
          packageName={packageName}
          selectedWebsiteType={selectedWebsiteType}
          onSelectWebsiteType={setSelectedWebsiteType}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && selectedWebsiteType && (
        <OrderDetailForm
          packageId={packageId}
          packageName={packageName}
          websiteType={selectedWebsiteType}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  );
}
