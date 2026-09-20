import React, { useState, useEffect } from 'react';
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { storageService } from '../../services/storage';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { storeSettings, refreshSettings, refreshData, storageMetrics } = useStore();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (storeSettings) {
      setSettings(JSON.parse(JSON.stringify(storeSettings)));
    }
  }, [storeSettings]);

  if (!settings) {
    return <div className="p-8 text-center text-xs text-charcoal-muted">Loading settings...</div>;
  }

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await storageService.updateStoreSettings(settings);
      await refreshSettings();
      showNotification('Store and WhatsApp settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // EXPORT BACKUP (Requirement #52, #53)
  const handleExportBackup = async () => {
    try {
      const backupJson = await storageService.exportBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modern-dresses-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Backup exported and downloaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to export backup');
    }
  };

  // IMPORT BACKUP (Requirement #52, #53)
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const ok = await storageService.importBackup(content);
        if (ok) {
          await refreshData();
          await refreshSettings();
          showNotification('Backup restored successfully into localStorage!');
        } else {
          alert('Invalid backup file format');
        }
      } catch (err) {
        alert('Failed to parse backup JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // RESET DEMO DATA (Requirement #52)
  const handleResetDemoData = async () => {
    try {
      await storageService.resetDemoData();
      await refreshData();
      await refreshSettings();
      setShowResetConfirm(false);
      showNotification('Reset completed: Original sample catalogue & settings restored!');
    } catch (err) {
      console.error(err);
      alert('Failed to reset demo data');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-charcoal text-white text-xs px-4 py-3 rounded-xl shadow-elevated flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-charcoal">
            Store & WhatsApp Settings
          </h1>
        
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal hover:bg-gold-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* DATA BACKUP & LOCALSTORAGE CONTROLS (Requirements #51, #52, #53) */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-boutique-100 rounded-xl text-charcoal">
              <HardDrive className="w-5 h-5 text-gold-700" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-charcoal">
                Data Management & LocalStorage Monitor
              </h2>
              <p className="text-xs text-charcoal-muted">
                Export and import your entire product catalogue, or reset to original sample data
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs font-bold text-charcoal">{storageMetrics.usedFormatted} used</div>
            <div className="text-[10px] text-charcoal-subtle">~{storageMetrics.percentEstimate}% of browser quota</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-charcoal rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-stone-600" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* WHATSAPP CONFIGURATION (Requirements #15, #40, #68) */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-charcoal">
                WhatsApp Configuration & Buttons
              </h2>
              <p className="text-xs text-charcoal-muted">
                Configure the boutique number and custom call-to-action text for product inquiries
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                WhatsApp Phone Number * (Indian format)
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="8951337609"
                className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl px-3.5 py-2.5 font-mono text-charcoal focus:outline-none"
              />
              <p className="text-[11px] text-charcoal-muted mt-1">
                Currently set to: <strong>+91 {settings.whatsappNumber}</strong>
              </p>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Standard WhatsApp CTA Button Text
              </label>
              <input
                type="text"
                value={settings.whatsappCtaText}
                onChange={(e) => setSettings({ ...settings, whatsappCtaText: e.target.value })}
                placeholder="ORDER THROUGH WHATSAPP"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Hidden Price CTA Button Text
              </label>
              <input
                type="text"
                value={settings.whatsappPriceHiddenCtaText}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappPriceHiddenCtaText: e.target.value })
                }
                placeholder="ASK FOR PRICE ON WHATSAPP"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Out Of Stock CTA Button Text
              </label>
              <input
                type="text"
                value={settings.whatsappOutOfStockCtaText}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappOutOfStockCtaText: e.target.value })
                }
                placeholder="ASK IF AVAILABLE"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* STORE IDENTITY & BIDAR LOCATION (Requirement #39) */}
      {/*  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-soft space-y-4 text-xs">
          <h2 className="font-editorial text-lg font-bold text-charcoal pb-2 border-b border-stone-100">
            Store Identity & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Location
              </label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                placeholder="Bidar, Karnataka"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Business Timings
              </label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Instagram Profile Link
              </label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-charcoal focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                Footer Story Text
              </label>
              <textarea
                rows={2}
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-charcoal focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-charcoal mb-1">
                About Boutique Story
              </label>
              <textarea
                rows={3}
                value={settings.aboutStory}
                onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-charcoal focus:outline-none"
              />
            </div>
          </div>
        </div> */}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-charcoal hover:bg-gold-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* RESET DEMO CONFIRMATION MODAL (Requirement #52, #56) */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">
                Reset Demo Data?
              </h3>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              This will restore all default demo categories (Boys, Girls, Women, Mens), realistic products, and CMS configurations. Any newly created or modified items will be replaced with the factory demo state.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow"
              >
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
