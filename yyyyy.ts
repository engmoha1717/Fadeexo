


import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
const http = httpRouter();
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";

// const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!; 
// const convex = new ConvexHttpClient(convexUrl);
// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const clerkWebhook =httpAction(async (ctx, request) => {
    const webhookSecret= process.env.CLERK_WEBHOOK_SECRET!;
    if (!webhookSecret) {
		throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
	}

    const svix_id = request.headers.get("svix-id");
	const svix_signature = request.headers.get("svix-signature");
	const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		});
	}

    const payload= await request.json();
    const body = JSON.stringify(payload);

    const wh= new Webhook(webhookSecret);

    let evt: WebhookEvent;
    
    try {
        evt= wh.verify(body ,{
            "svix-id":svix_id,
            "svix-timestamp":svix_timestamp,
            "svix-signature":svix_signature
        }) as WebhookEvent
    }catch (err) {
        console.error("Error verifying webhook:", err);
		return new Response("Error occurred", { status: 400 });
    }

    const eventType= evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;    
        try {
          // Get primary email
          
    
          // Create or update user in Convex
          await ctx.runMutation(api.clerkUsers.storeFromWebhook, {
            clerkId: id,
            email: email_addresses[0]?.email_address || "",
            name: `${first_name || ""} ${last_name || ""}`.trim() || "Anonymous",
            imageUrl: image_url || undefined,
          });
        
          return Response.json({ success: true }); 
        } catch (error) {
          console.error("Error syncing user to Convex:", error);
          return new Response("Error syncing user to Convex", {
            status: 500,
          });
        }
      }


    return new Response("Webhook processed successfully", { status: 200 });  
})

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler:clerkWebhook
})

export default http;