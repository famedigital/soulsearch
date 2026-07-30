'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Rocket,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SetupStepBody } from '@/components/admin/setup/SetupStepBody'
import {
  SETUP_STEP_META,
  SETUP_STEPS,
  createDefaultSetupDraft,
  nextSetupStep,
  prevSetupStep,
  type SetupDraft,
  type SetupStepId,
} from '@/lib/setup-config'
import { cn } from '@/lib/utils'

type Progress = {
  completedCount: number
  totalCount: number
  readyToPublish: boolean
  blockingErrors: string[]
  steps: Array<{ id: SetupStepId; complete: boolean; errors: string[] }>
}

export function SetupWizard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [currentStep, setCurrentStep] = useState<SetupStepId>('identity')
  const [draft, setDraft] = useState<SetupDraft>(createDefaultSetupDraft())
  const [progress, setProgress] = useState<Progress | null>(null)
  const [completed, setCompleted] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const draftRef = useRef(draft)
  const stepRef = useRef(currentStep)

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    stepRef.current = currentStep
  }, [currentStep])

  const persist = useCallback(
    async (nextDraft: SetupDraft, nextStep: SetupStepId) => {
      setSaving(true)
      try {
        const response = await fetch('/api/admin/setup', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft: nextDraft, currentStep: nextStep }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to save')
        setProgress(data.progress)
        setCompleted(Boolean(data.completed))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to save draft')
      } finally {
        setSaving(false)
      }
    },
    []
  )

  const scheduleSave = useCallback(
    (nextDraft: SetupDraft, nextStep = stepRef.current) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        void persist(nextDraft, nextStep)
      }, 700)
    },
    [persist]
  )

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/setup')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to load setup')
        if (cancelled) return
        setDraft(data.draft)
        setCurrentStep(data.currentStep || 'identity')
        setProgress(data.progress)
        setCompleted(Boolean(data.completed))
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load setup')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const updateDraft = (next: SetupDraft) => {
    setDraft(next)
    scheduleSave(next)
  }

  const goToStep = async (step: SetupStepId) => {
    setCurrentStep(step)
    await persist(draftRef.current, step)
  }

  const publish = async () => {
    setPublishing(true)
    try {
      await persist(draftRef.current, 'review')
      const response = await fetch('/api/admin/setup/publish', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data.blockingErrors?.join('; ') || data.error || 'Publish failed'
        )
      }
      setCompleted(true)
      toast.success('Website published — your public site is live.')
      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  const meta = SETUP_STEP_META.find((s) => s.id === currentStep)!
  const stepIndex = SETUP_STEPS.indexOf(currentStep)
  const currentValidation = progress?.steps.find((s) => s.id === currentStep)

  return (
    <div className="grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <Card className="h-fit space-y-1 p-3">
        {SETUP_STEP_META.map((step, index) => {
          const done = progress?.steps.find((s) => s.id === step.id)?.complete
          const active = step.id === currentStep
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => void goToStep(step.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                active ? 'bg-primary/10 text-foreground' : 'hover:bg-muted'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold',
                  done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : active
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground'
                )}
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
              <span>
                <span className="block font-medium">{step.title}</span>
                <span className="block text-xs text-muted-foreground">{step.description}</span>
              </span>
            </button>
          )
        })}
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {stepIndex + 1} of {SETUP_STEPS.length}
              </p>
              <h2 className="font-heading mt-1 text-2xl font-bold">{meta.title}</h2>
              <p className="mt-1 text-muted-foreground">{meta.description}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {saving ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving draft…
                </span>
              ) : (
                <span>Draft saved privately — not live yet</span>
              )}
              {completed && (
                <p className="mt-1 font-medium text-primary">Website already published</p>
              )}
            </div>
          </div>

          <SetupStepBody step={currentStep} draft={draft} onChange={updateDraft} />

          {currentValidation && currentValidation.errors.length > 0 && currentStep !== 'review' && (
            <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
              <p className="mb-1 flex items-center gap-2 font-medium">
                <AlertCircle className="size-4" />
                Finish these before continuing
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {currentValidation.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <div className="flex gap-2">
              <Link
                href="/admin/dashboard"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Exit to dashboard
              </Link>
              {stepIndex > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void goToStep(prevSetupStep(currentStep))}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              )}
            </div>

            {currentStep !== 'review' ? (
              <Button type="button" onClick={() => void goToStep(nextSetupStep(currentStep))}>
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={publishing || !progress?.readyToPublish}
                onClick={() => void publish()}
              >
                {publishing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Rocket className="size-4" />
                )}
                {completed ? 'Publish updates' : 'Publish website'}
              </Button>
            )}
          </div>
        </Card>

        {currentStep === 'review' && progress && (
          <Card className="p-5">
            <h3 className="font-heading mb-3 text-lg font-semibold">Publish checklist</h3>
            <div className="space-y-2">
              {progress.steps.map((step) => {
                const label = SETUP_STEP_META.find((s) => s.id === step.id)?.title || step.id
                return (
                  <div
                    key={step.id}
                    className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{label}</p>
                      {!step.complete && (
                        <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
                          {step.errors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void goToStep(step.id)}
                    >
                      {step.complete ? 'Edit' : 'Fix'}
                    </Button>
                  </div>
                )
              })}
            </div>
            {!progress.readyToPublish && (
              <p className="mt-4 text-sm text-muted-foreground">
                Complete every section above before publishing. Your draft stays private until then.
              </p>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
