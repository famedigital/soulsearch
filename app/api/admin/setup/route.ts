import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/jwt'
import { getSetupState, saveSetupState } from '@/lib/setup'
import {
  SETUP_STEPS,
  getSetupProgress,
  normalizeSetupDraft,
  normalizeSetupState,
  type SetupStepId,
} from '@/lib/setup-config'

export const dynamic = 'force-dynamic'

/** GET /api/admin/setup — status + draft for the first-login wizard */
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const state = await getSetupState()
    const progress = getSetupProgress(state.draft)

    return NextResponse.json({
      completed: state.completed,
      dismissed: state.dismissed,
      currentStep: state.currentStep,
      completedAt: state.completedAt,
      lastError: state.lastError,
      draft: state.draft,
      progress,
      steps: SETUP_STEPS,
    })
  } catch (error) {
    console.error('[GET /api/admin/setup]', error)
    return NextResponse.json({ error: 'Failed to load setup state' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/setup — save draft / current step / dismiss flag.
 * Does not publish anything to the public site.
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const current = await getSetupState()
    const next = normalizeSetupState(current)

    if (body.draft !== undefined) {
      next.draft = normalizeSetupDraft(body.draft)
    }

    if (typeof body.currentStep === 'string' && SETUP_STEPS.includes(body.currentStep)) {
      next.currentStep = body.currentStep as SetupStepId
    }

    if (typeof body.dismissed === 'boolean') {
      next.dismissed = body.dismissed
    }

    // Saving a draft never completes setup — only publish does.
    next.lastError = null

    const saved = await saveSetupState(next)
    const progress = getSetupProgress(saved.draft)

    return NextResponse.json({
      ok: true,
      completed: saved.completed,
      dismissed: saved.dismissed,
      currentStep: saved.currentStep,
      draft: saved.draft,
      progress,
    })
  } catch (error) {
    console.error('[PATCH /api/admin/setup]', error)
    return NextResponse.json({ error: 'Failed to save setup draft' }, { status: 500 })
  }
}
