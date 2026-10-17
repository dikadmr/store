import {
  addData,
  retrieveData,
  retrieveDataByFields,
} from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("client_id");

    const projects = clientId
      ? await retrieveDataByFields("projects", "client_id", clientId)
      : await retrieveData("projects");

    return NextResponse.json({ status: true, data: projects }, { status: 200 });
  } catch (error) {
    console.error("GET /api/project error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to retrieve projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("POST /api/project PAYLOAD:", data);

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!data.name?.trim()) {
      return NextResponse.json(
        {
          status: false,
          message: "Project name is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!data.package?.id) {
      return NextResponse.json(
        {
          status: false,
          message: "Package is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!data.websiteType?.id) {
      return NextResponse.json(
        {
          status: false,
          message: "Website type is required",
        },
        {
          status: 400,
        },
      );
    }

    const newProject = {
      user_id: data.user_id ?? null,

      client_id: data.client_id ?? null,

      name: data.name.trim(),

      owner_type: data.owner_type ?? "",

      description: data.description ?? "",

      target_audience: data.target_audience ?? "",

      goal: data.goal ?? "",

      information_contact: data.information_contact ?? "",

      service_location: data.service_location ?? "",

      package: data.package ?? null,

      website_type: data.websiteType ?? null,

      design: data.design ?? {
        reference: "",
      },

      timeline: data.timeline ?? {
        targetStart: "",
        targetFinish: "",
      },

      requirements: data.requirements ?? {
        basic: null,
        professional: null,
        enterprise: null,
      },

      assets: Array.isArray(data.assets) ? data.assets : [],

      additional_note: data.additional_note ?? "",

      status: data.status ?? "pending",

      created_at: Timestamp.now(),

      updated_at: Timestamp.now(),
    };

    const projectId = await addData("projects", newProject);

    return NextResponse.json(
      {
        status: true,

        message: "Project created successfully",

        data: {
          id: projectId,
          ...newProject,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/project error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to create project",
      },
      {
        status: 500,
      },
    );
  }
}
