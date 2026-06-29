import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const params = await props.params;
    const id = parseInt(params.id, 10);
    const body = await request.json();

    const site = await prisma.site360Site.update({
      where: { id },
      data: {
        data: body,
      },
    });

    return NextResponse.json(site.data);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
