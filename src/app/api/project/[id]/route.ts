import {
  deleteData,
  retrieveDataById,
  updateData,
  retrieveDataByFields,
} from "@/lib/firebase/service";

import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "Project ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const project = await retrieveDataById("projects", id);

    if (!project) {
      return NextResponse.json(
        {
          status: false,
          message: "Project not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        status: true,
        data: project,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET /api/project/[id] error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to retrieve project",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "Project ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const existingProject = await retrieveDataById("projects", id);

    if (!existingProject) {
      return NextResponse.json(
        {
          status: false,
          message: "Project not found",
        },
        {
          status: 404,
        },
      );
    }

    const data = await request.json();

    const { id: bodyId, created_at, ...updatePayload } = data;

    const newData = {
      ...updatePayload,
      updated_at: Timestamp.now(),
    };

    await updateData("projects", id, newData);

    const updatedProject = await retrieveDataById("projects", id);

    return NextResponse.json(
      {
        status: true,
        message: "Project updated successfully",
        data: updatedProject,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("PUT /api/project/[id] error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to update project",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Project ID is required" },
        { status: 400 },
      );
    }

    const existingProject = await retrieveDataById("projects", id);
    if (!existingProject) {
      return NextResponse.json(
        { status: false, message: "Project not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    if (!force) {
      const relatedOrders = await retrieveDataByFields(
        "orders",
        "project_id",
        id,
      );

      if (relatedOrders.length > 0) {
        return NextResponse.json(
          {
            status: false,
            message: `Project tidak bisa dihapus karena masih memiliki ${relatedOrders.length} order terkait. Gunakan force=true untuk memaksa hapus.`,
            relatedOrderIds: (
              relatedOrders as { id: string }[]
            ).map((o) => o.id),
          },
          { status: 409 },
        );
      }
    }

    await deleteData("projects", id);

    return NextResponse.json(
      { status: true, message: "Project deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/project/[id] error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to delete project" },
      { status: 500 },
    );
  }
}
