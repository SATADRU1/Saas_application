"use client";

import { WidgetHeader } from "../components/widget-header";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useSetAtom, useAtomValue } from "jotai";
import { contactSessionIdAtomFamily , organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";



// ------------------ Schema ------------------
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
});

// ⚠️ Replace later with real dynamic value
const organizationId = "123";

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId || ""));
  const setScreen = useSetAtom(screenAtom);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(
    api.public.contactSessions.createContactSession
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) return;

    try {
      // Safe metadata collection (prevents undefined crashes)
      const metadata =
        typeof window !== "undefined"
          ? {
              userAgent: navigator.userAgent ?? "",
              language: navigator.language ?? "",
              languages: navigator.languages?.join(",") ?? "",
              platform: navigator.platform ?? "",
              vendor: navigator.vendor ?? "",
              screenResolution: `${window.screen.width}x${window.screen.height}`,
              colorDepth: window.screen.colorDepth ?? 0,
              viewportSize: `${window.innerWidth}x${window.innerHeight}`,
              timezone:
                Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
              timezoneOffset: new Date().getTimezoneOffset(),
              cookiesEnabled: navigator.cookieEnabled ?? false,
              referrer: document.referrer || "direct",
              currentUrl: window.location.href ?? "",
            }
          : {};

      const contactSessionId = await createContactSession({
        organizationId,
        name: values.name,
        email: values.email,
        metadata,
        expireAt: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
      });
      console.log({ contactSessionId });

      // Optional: reset form after success
      form.reset();
      
      setContactSessionId(contactSessionId);
      setScreen("selection");
    } catch (error) {
      console.error("Failed to create contact session:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="text-3xl font-semibold">Hi there! 👋</p>
          <p className="text-lg opacity-90 font-semibold">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>

      {/* Form */}
      <Form {...form}>
        <form
          className="flex flex-1 flex-col gap-y-4 p-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-12 bg-background"
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g. ab12@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            size="lg"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};