import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const VoteSchema = z.object({
  reviewId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to vote.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = VoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid reviewId' }, { status: 400 });
    }

    const { reviewId } = parsed.data;
    const adminClient = createAdminClient();

    // 1. Insert into review_votes
    const { error: voteError } = await adminClient.from('review_votes').insert({
      review_id: reviewId,
      voter_id: user.id,
    });

    if (voteError) {
      return NextResponse.json(
        { error: 'You have already marked this review as helpful.' },
        { status: 409 }
      );
    }

    // 2. Increment helpful count
    await adminClient.rpc('increment_review_helpful', { p_review_id: reviewId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vote review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
