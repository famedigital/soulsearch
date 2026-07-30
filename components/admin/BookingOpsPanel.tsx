'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Upload,
  Link2,
  Copy,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BOOKING_DOC_TYPE_LABELS,
  emptyHotel,
  emptyOperations,
  type BookingDocument,
  type BookingDocType,
  type BookingOperations,
  type BookingShareLink,
  type HotelStay,
} from '@/lib/bookings/operations';

type Tab = 'operations' | 'itinerary' | 'documents' | 'share';

type ItineraryDay = {
  day?: string | number;
  title?: string;
  location?: string;
  description?: string;
  meals?: string;
  accommodation?: string;
};

export function BookingOpsPanel({
  bookingId,
  bookingStatus,
}: {
  bookingId: string;
  bookingStatus: string;
}) {
  const [tab, setTab] = useState<Tab>('operations');
  const [ops, setOps] = useState<BookingOperations>(emptyOperations(bookingId));
  const [docs, setDocs] = useState<BookingDocument[]>([]);
  const [links, setLinks] = useState<BookingShareLink[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [itinerarySource, setItinerarySource] = useState<'override' | 'package'>('package');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingItinerary, setSavingItinerary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState<BookingDocType>('room_voucher');
  const [docTitle, setDocTitle] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [opsRes, docsRes, linksRes, itinRes] = await Promise.all([
        fetch(`/api/admin/bookings/${bookingId}/operations`),
        fetch(`/api/admin/bookings/${bookingId}/documents`),
        fetch(`/api/admin/bookings/${bookingId}/share-links`),
        fetch(`/api/admin/bookings/${bookingId}/itinerary`),
      ]);
      const opsJson = await opsRes.json();
      const docsJson = await docsRes.json();
      const linksJson = await linksRes.json();
      const itinJson = await itinRes.json();

      if (opsRes.ok) setOps(opsJson.operations || emptyOperations(bookingId));
      else if (opsJson.error) toast.error(opsJson.error);

      if (docsRes.ok) setDocs(docsJson.documents || []);
      if (linksRes.ok) setLinks(linksJson.links || []);
      if (itinRes.ok) {
        setItinerary(itinJson.itinerary || []);
        setItinerarySource(itinJson.source === 'override' ? 'override' : 'package');
      }
    } catch {
      toast.error('Failed to load operations data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const updateOpsField = (field: keyof BookingOperations, value: string) => {
    setOps((prev) => ({ ...prev, [field]: value }));
  };

  const updateHotel = (index: number, field: keyof HotelStay, value: string) => {
    setOps((prev) => {
      const hotels = [...(prev.hotels || [])];
      hotels[index] = { ...hotels[index], [field]: value };
      return { ...prev, hotels };
    });
  };

  const saveOps = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/operations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ops),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setOps(json.operations);
      toast.success('Operations saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save operations');
    } finally {
      setSaving(false);
    }
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: string) => {
    setItinerary((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const saveItinerary = async () => {
    setSavingItinerary(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setItinerary(json.itinerary || []);
      setItinerarySource(json.has_override ? 'override' : 'package');
      toast.success('Client itinerary saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save itinerary');
    } finally {
      setSavingItinerary(false);
    }
  };

  const resetItineraryToPackage = async () => {
    setSavingItinerary(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clear: true }),
      });
      const cleared = await res.json();
      if (!res.ok) throw new Error(cleared.error || 'Reset failed');
      const reload = await fetch(`/api/admin/bookings/${bookingId}/itinerary`);
      const json = await reload.json();
      setItinerary(json.itinerary || []);
      setItinerarySource('package');
      toast.success('Reset to tour package itinerary');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset itinerary');
    } finally {
      setSavingItinerary(false);
    }
  };

  const uploadDocument = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'soulsearch/booking-docs');
      form.append('resourceType', 'auto');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: form });
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploaded.error || 'Upload failed');

      const res = await fetch(`/api/admin/bookings/${bookingId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_type: docType,
          title: docTitle || file.name,
          file_url: uploaded.secure_url || uploaded.url,
          file_public_id: uploaded.public_id,
          file_name: uploaded.file_name || file.name,
          mime_type: uploaded.mime_type || file.type,
          file_size: uploaded.file_size || file.size,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save document');

      setDocs((prev) => [json.document, ...prev]);
      setDocTitle('');
      toast.success('Document uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = async (docId: string) => {
    const res = await fetch(`/api/admin/bookings/${bookingId}/documents?docId=${docId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      toast.error('Failed to delete document');
      return;
    }
    setDocs((prev) => prev.filter((d) => d.id !== docId));
    toast.success('Document removed');
  };

  const createShareLink = async (audience: 'client' | 'staff') => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/share-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audience }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create link');

      setLinks((prev) => {
        const without = prev.filter((l) => !(l.audience === audience && l.is_active));
        return [json.link, ...without];
      });

      const absolute = `${window.location.origin}${json.link.url}`;
      await navigator.clipboard.writeText(absolute);
      toast.success(
        audience === 'client'
          ? 'Client naked itinerary link copied'
          : 'Guide/driver (no rates) link copied'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create share link');
    }
  };

  const copyLink = async (path: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success('Link copied');
  };

  const revokeLink = async (linkId: string) => {
    const res = await fetch(`/api/admin/bookings/${bookingId}/share-links?linkId=${linkId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      toast.error('Failed to revoke link');
      return;
    }
    setLinks((prev) => prev.map((l) => (l.id === linkId ? { ...l, is_active: false } : l)));
    toast.success('Link revoked');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookingStatus !== 'confirmed' && bookingStatus !== 'completed' ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Tip: confirm the booking first, then fill Operations (guide, driver, hotels) and share links.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {(
          [
            ['operations', 'Operations'],
            ['itinerary', 'Itinerary'],
            ['documents', 'Documents'],
            ['share', 'Share'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'operations' ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="space-y-3 rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-semibold">Guide</legend>
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={ops.guide_name || ''} onChange={(e) => updateOpsField('guide_name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={ops.guide_phone || ''} onChange={(e) => updateOpsField('guide_phone', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={ops.guide_email || ''} onChange={(e) => updateOpsField('guide_email', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input value={ops.guide_notes || ''} onChange={(e) => updateOpsField('guide_notes', e.target.value)} />
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-semibold">Driver</legend>
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={ops.driver_name || ''} onChange={(e) => updateOpsField('driver_name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={ops.driver_phone || ''} onChange={(e) => updateOpsField('driver_phone', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={ops.driver_email || ''} onChange={(e) => updateOpsField('driver_email', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input value={ops.driver_notes || ''} onChange={(e) => updateOpsField('driver_notes', e.target.value)} />
              </div>
            </fieldset>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Hotels</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOps((prev) => ({ ...prev, hotels: [...(prev.hotels || []), emptyHotel()] }))}
              >
                <Plus className="h-4 w-4" />
                Add hotel
              </Button>
            </div>

            {(ops.hotels || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No hotels added yet.</p>
            ) : (
              ops.hotels.map((hotel, index) => (
                <div key={index} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Hotel {index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOps((prev) => ({
                          ...prev,
                          hotels: prev.hotels.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input placeholder="Hotel name" value={hotel.name} onChange={(e) => updateHotel(index, 'name', e.target.value)} />
                    <Input placeholder="Location" value={hotel.location || ''} onChange={(e) => updateHotel(index, 'location', e.target.value)} />
                    <Input placeholder="Check-in" type="date" value={hotel.check_in || ''} onChange={(e) => updateHotel(index, 'check_in', e.target.value)} />
                    <Input placeholder="Check-out" type="date" value={hotel.check_out || ''} onChange={(e) => updateHotel(index, 'check_out', e.target.value)} />
                    <Input placeholder="Room type" value={hotel.room_type || ''} onChange={(e) => updateHotel(index, 'room_type', e.target.value)} />
                    <Input placeholder="Confirmation no." value={hotel.confirmation_no || ''} onChange={(e) => updateHotel(index, 'confirmation_no', e.target.value)} />
                  </div>
                  <Input placeholder="Notes" value={hotel.notes || ''} onChange={(e) => updateHotel(index, 'notes', e.target.value)} />
                </div>
              ))
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Internal notes</Label>
            <Input
              value={ops.internal_notes || ''}
              onChange={(e) => updateOpsField('internal_notes', e.target.value)}
              placeholder="Ops notes (not shown on client share)"
            />
          </div>

          <Button type="button" onClick={saveOps} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save operations
          </Button>
        </div>
      ) : null}

      {tab === 'itinerary' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {itinerarySource === 'override'
                ? 'Custom itinerary for this client (shared links use these days).'
                : 'Showing tour package itinerary — edit and save to customize for this client.'}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setItinerary((prev) => [
                    ...prev,
                    {
                      day: prev.length + 1,
                      title: '',
                      location: '',
                      description: '',
                      meals: '',
                      accommodation: '',
                    },
                  ])
                }
              >
                <Plus className="h-4 w-4" />
                Add day
              </Button>
              {itinerarySource === 'override' ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={savingItinerary}
                  onClick={resetItineraryToPackage}
                >
                  Reset to package
                </Button>
              ) : null}
            </div>
          </div>

          {itinerary.length === 0 ? (
            <p className="text-sm text-muted-foreground">No itinerary days yet.</p>
          ) : (
            <div className="space-y-3">
              {itinerary.map((day, index) => (
                <div key={index} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Day {day.day ?? index + 1}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setItinerary((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input
                      placeholder="Day number"
                      value={String(day.day ?? index + 1)}
                      onChange={(e) => updateItineraryDay(index, 'day', e.target.value)}
                    />
                    <Input
                      placeholder="Title"
                      value={day.title || ''}
                      onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={day.location || ''}
                      onChange={(e) => updateItineraryDay(index, 'location', e.target.value)}
                    />
                    <Input
                      placeholder="Meals"
                      value={day.meals || ''}
                      onChange={(e) => updateItineraryDay(index, 'meals', e.target.value)}
                    />
                    <Input
                      className="md:col-span-2"
                      placeholder="Accommodation"
                      value={day.accommodation || ''}
                      onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                    />
                  </div>
                  <textarea
                    className="min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="Description"
                    value={day.description || ''}
                    onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <Button type="button" onClick={saveItinerary} disabled={savingItinerary}>
            {savingItinerary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save client itinerary
          </Button>
        </div>
      ) : null}

      {tab === 'documents' ? (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={docType}
                onChange={(e) => setDocType(e.target.value as BookingDocType)}
              >
                {(Object.keys(BOOKING_DOC_TYPE_LABELS) as BookingDocType[]).map((key) => (
                  <option key={key} value={key}>
                    {BOOKING_DOC_TYPE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Title (optional)</Label>
              <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="e.g. Paro hotel voucher" />
            </div>
            <div className="md:col-span-3">
              <Label
                htmlFor="booking-doc-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload PDF, DOC, or image
              </Label>
              <input
                id="booking-doc-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif,application/pdf,image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadDocument(file);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{doc.title || doc.file_name || 'Document'}</p>
                    <p className="text-xs text-muted-foreground">
                      {BOOKING_DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      Open
                    </a>
                    <Button type="button" variant="ghost" size="sm" onClick={() => deleteDoc(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === 'share' ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={() => createShareLink('client')}>
              <Link2 className="h-4 w-4" />
              Client naked itinerary
            </Button>
            <Button type="button" variant="outline" onClick={() => createShareLink('staff')}>
              <Link2 className="h-4 w-4" />
              Guide & driver (no rates)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Both links hide prices. Staff link includes guide, driver, and hotels from Operations.
          </p>

          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No share links yet.</p>
          ) : (
            <ul className="space-y-2">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {link.label || link.audience}
                      {!link.is_active ? (
                        <span className="ml-2 text-xs text-muted-foreground">(revoked)</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {link.is_active ? (
                      <>
                        <Button type="button" variant="ghost" size="sm" onClick={() => copyLink(link.url || '')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Button type="button" variant="ghost" size="sm" onClick={() => revokeLink(link.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
