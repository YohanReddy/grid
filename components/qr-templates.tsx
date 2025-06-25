"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wifi,
  User,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
} from "lucide-react";
import { memo, useState } from "react";

interface QRTemplatesProps {
  onTemplateGenerate: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QRTemplates = memo(function QRTemplates({
  onTemplateGenerate,
  isOpen,
  onClose,
}: QRTemplatesProps) {
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });

  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    url: "",
  });

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const [smsData, setSmsData] = useState({
    phone: "",
    message: "",
  });

  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
    label: "",
  });

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const generateWifiQR = () => {
    const { ssid, password, security, hidden } = wifiData;
    if (!ssid) return;

    const content = `WIFI:T:${security};S:${ssid};P:${password};H:${
      hidden ? "true" : "false"
    };;`;
    onTemplateGenerate(content);
    onClose();
  };

  const generateContactQR = () => {
    const { firstName, lastName, phone, email, organization, url } =
      contactData;
    if (!firstName && !lastName) return;

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${firstName} ${lastName}`.trim(),
      firstName && `N:${lastName};${firstName};;;`,
      phone && `TEL:${phone}`,
      email && `EMAIL:${email}`,
      organization && `ORG:${organization}`,
      url && `URL:${url}`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    onTemplateGenerate(vcard);
    onClose();
  };

  const generateEmailQR = () => {
    const { to, subject, body } = emailData;
    if (!to) return;

    let content = `mailto:${to}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);

    if (params.length > 0) {
      content += `?${params.join("&")}`;
    }

    onTemplateGenerate(content);
    onClose();
  };

  const generateSmsQR = () => {
    const { phone, message } = smsData;
    if (!phone) return;

    const content = `sms:${phone}${
      message ? `?body=${encodeURIComponent(message)}` : ""
    }`;
    onTemplateGenerate(content);
    onClose();
  };

  const generateLocationQR = () => {
    const { latitude, longitude } = locationData;
    if (!latitude || !longitude) return;

    const content = `geo:${latitude},${longitude}`;
    onTemplateGenerate(content);
    onClose();
  };

  const generateEventQR = () => {
    const { title, description, location, startDate, endDate } = eventData;
    if (!title || !startDate) return;

    const formatDate = (date: string) =>
      new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//QRaft//QR Code Generator//EN",
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(startDate)}`,
      endDate && `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${title}`,
      description && `DESCRIPTION:${description}`,
      location && `LOCATION:${location}`,
      `UID:${Date.now()}@qraft.app`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\n");

    onTemplateGenerate(ics);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">QR Code Templates</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0"
            >
              ✕
            </Button>
          </div>

          <Tabs defaultValue="wifi" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger
                value="wifi"
                className="flex items-center gap-1 text-xs"
              >
                <Wifi className="h-3 w-3" />
                WiFi
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="flex items-center gap-1 text-xs"
              >
                <User className="h-3 w-3" />
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="flex items-center gap-1 text-xs"
              >
                <Mail className="h-3 w-3" />
                Email
              </TabsTrigger>
              <TabsTrigger
                value="sms"
                className="flex items-center gap-1 text-xs"
              >
                <MessageSquare className="h-3 w-3" />
                SMS
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="flex items-center gap-1 text-xs"
              >
                <MapPin className="h-3 w-3" />
                Location
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="flex items-center gap-1 text-xs"
              >
                <Calendar className="h-3 w-3" />
                Event
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wifi" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                  <Input
                    id="wifi-ssid"
                    value={wifiData.ssid}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, ssid: e.target.value })
                    }
                    placeholder="MyWiFiNetwork"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wifi-password">Password</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    value={wifiData.password}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wifi-security">Security Type</Label>
                  <select
                    id="wifi-security"
                    value={wifiData.security}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, security: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Network Settings</Label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={wifiData.hidden}
                      onChange={(e) =>
                        setWifiData({ ...wifiData, hidden: e.target.checked })
                      }
                    />
                    <span className="text-sm">Hidden Network</span>
                  </label>
                </div>
              </div>
              <Button
                onClick={generateWifiQR}
                className="w-full"
                disabled={!wifiData.ssid}
              >
                Generate WiFi QR Code
              </Button>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-first">First Name</Label>
                  <Input
                    id="contact-first"
                    value={contactData.firstName}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-last">Last Name</Label>
                  <Input
                    id="contact-last"
                    value={contactData.lastName}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={contactData.phone}
                    onChange={(e) =>
                      setContactData({ ...contactData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) =>
                      setContactData({ ...contactData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-org">Organization</Label>
                  <Input
                    id="contact-org"
                    value={contactData.organization}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        organization: e.target.value,
                      })
                    }
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-url">Website</Label>
                  <Input
                    id="contact-url"
                    value={contactData.url}
                    onChange={(e) =>
                      setContactData({ ...contactData, url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <Button
                onClick={generateContactQR}
                className="w-full"
                disabled={!contactData.firstName && !contactData.lastName}
              >
                Generate Contact QR Code
              </Button>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email-to">To Email</Label>
                <Input
                  id="email-to"
                  type="email"
                  value={emailData.to}
                  onChange={(e) =>
                    setEmailData({ ...emailData, to: e.target.value })
                  }
                  placeholder="recipient@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Your email subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Message</Label>
                <textarea
                  id="email-body"
                  value={emailData.body}
                  onChange={(e) =>
                    setEmailData({ ...emailData, body: e.target.value })
                  }
                  placeholder="Your email message..."
                  className="w-full p-2 border rounded-md h-24 resize-none"
                />
              </div>
              <Button
                onClick={generateEmailQR}
                className="w-full"
                disabled={!emailData.to}
              >
                Generate Email QR Code
              </Button>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sms-phone">Phone Number</Label>
                <Input
                  id="sms-phone"
                  value={smsData.phone}
                  onChange={(e) =>
                    setSmsData({ ...smsData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-message">Message (optional)</Label>
                <textarea
                  id="sms-message"
                  value={smsData.message}
                  onChange={(e) =>
                    setSmsData({ ...smsData, message: e.target.value })
                  }
                  placeholder="Your SMS message..."
                  className="w-full p-2 border rounded-md h-24 resize-none"
                />
              </div>
              <Button
                onClick={generateSmsQR}
                className="w-full"
                disabled={!smsData.phone}
              >
                Generate SMS QR Code
              </Button>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location-lat">Latitude</Label>
                  <Input
                    id="location-lat"
                    type="number"
                    step="any"
                    value={locationData.latitude}
                    onChange={(e) =>
                      setLocationData({
                        ...locationData,
                        latitude: e.target.value,
                      })
                    }
                    placeholder="37.7749"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-lng">Longitude</Label>
                  <Input
                    id="location-lng"
                    type="number"
                    step="any"
                    value={locationData.longitude}
                    onChange={(e) =>
                      setLocationData({
                        ...locationData,
                        longitude: e.target.value,
                      })
                    }
                    placeholder="-122.4194"
                  />
                </div>
              </div>
              <Button
                onClick={generateLocationQR}
                className="w-full"
                disabled={!locationData.latitude || !locationData.longitude}
              >
                Generate Location QR Code
              </Button>
            </TabsContent>

            <TabsContent value="event" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  placeholder="My Event"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-start">Start Date & Time</Label>
                  <Input
                    id="event-start"
                    type="datetime-local"
                    value={eventData.startDate}
                    onChange={(e) =>
                      setEventData({ ...eventData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-end">End Date & Time</Label>
                  <Input
                    id="event-end"
                    type="datetime-local"
                    value={eventData.endDate}
                    onChange={(e) =>
                      setEventData({ ...eventData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={eventData.location}
                  onChange={(e) =>
                    setEventData({ ...eventData, location: e.target.value })
                  }
                  placeholder="123 Main St, City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <textarea
                  id="event-description"
                  value={eventData.description}
                  onChange={(e) =>
                    setEventData({ ...eventData, description: e.target.value })
                  }
                  placeholder="Event description..."
                  className="w-full p-2 border rounded-md h-24 resize-none"
                />
              </div>
              <Button
                onClick={generateEventQR}
                className="w-full"
                disabled={!eventData.title || !eventData.startDate}
              >
                Generate Event QR Code
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
});
