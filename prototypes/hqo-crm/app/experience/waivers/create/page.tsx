"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ScrollText } from "lucide-react";
import Link from "next/link";

export default function CreateWaiverPage() {
  const [waiverName, setWaiverName] = useState("");
  const [waiverDescription, setWaiverDescription] = useState("");
  const [waiverType, setWaiverType] = useState("");
  const [waiverContent, setWaiverContent] = useState("");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 border-b bg-white">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/experience/waivers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to waivers
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-blue-100">
            <ScrollText className="w-8 h-8 text-gray-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Waiver
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new liability waiver for your tenants
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Waiver name</label>
                    <Input
                      placeholder="Enter waiver name"
                      value={waiverName}
                      onChange={(e) => setWaiverName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Enter waiver description"
                      value={waiverDescription}
                      onChange={(e) => setWaiverDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={waiverType} onValueChange={setWaiverType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select waiver type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fitness & Wellness">
                          Fitness & Wellness
                        </SelectItem>
                        <SelectItem value="Events & Activities">
                          Events & Activities
                        </SelectItem>
                        <SelectItem value="Facility Access">
                          Facility Access
                        </SelectItem>
                        <SelectItem value="Media & Marketing">
                          Media & Marketing
                        </SelectItem>
                        <SelectItem value="Equipment & Resources">
                          Equipment & Resources
                        </SelectItem>
                        <SelectItem value="Guest & Visitor">
                          Guest & Visitor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Waiver Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium">Legal content</label>
                    <Textarea
                      placeholder="Enter the waiver legal content and terms..."
                      className="min-h-[300px] font-mono text-sm"
                      value={waiverContent}
                      onChange={(e) => setWaiverContent(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select defaultValue="draft">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Expiration date
                    </label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Require IP tracking
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Email confirmation
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Digital signature required
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Preview how your waiver will appear to tenants before
                    publishing.
                  </p>
                  <Button variant="outline" className="w-full mt-3">
                    Preview waiver
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-8">
            <Button variant="outline" asChild>
              <Link href="/experience/waivers">Cancel</Link>
            </Button>
            <Button variant="outline">Save as draft</Button>
            <Button>Create waiver</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
