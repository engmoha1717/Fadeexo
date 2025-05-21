import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

const clerkWebhook = httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
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

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;
    
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred", { status: 400 });
    }

    const eventType = payload.type;
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = payload.data;
        
        // All users start with role "user"
        // You will need to manually upgrade users to admin or editor in the database
        await ctx.runMutation(api.users.createUser, {
            clerkId: id,
            email: email_addresses[0]?.email_address || "",
            firstName: first_name || "",
            lastName: last_name || "",
            imageUrl: image_url || "",
            role: "user",
        });
      }

    // if (eventType === "user.created") {
    //     const { id, email_addresses, first_name, last_name, image_url } = payload.data;
        
    //     // Determine role based on email or other criteria
    //     let role = "user"; // default role
        
    //     // You can set specific emails as admin/editor
    //     const adminEmails = ["admin@yoursite.com", "owner@yoursite.com","suudaanimoha@gmail.com"];
    //     const editorEmails = ["editor@yoursite.com", "journalist@yoursite.com"];
        
    //     const userEmail = email_addresses[0]?.email_address || "";
        
    //     if (adminEmails.includes(userEmail)) {
    //         role = "admin";
    //     } else if (editorEmails.includes(userEmail)) {
    //         role = "editor";
    //     }
        
    //     // Create user in Convex with role
    //     await ctx.runMutation(api.users.createUser, {
    //         clerkId: id,
    //         email: userEmail,
    //         firstName: first_name || "",
    //         lastName: last_name || "",
    //         imageUrl: image_url || "",
    //         role: role as "admin" | "editor" | "user",
    //     });

    //     console.log(`User created: ${userEmail} with role: ${role}`);
    // }

    if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = payload.data;
        
        await ctx.runMutation(api.users.updateUser, {
            clerkId: id,
            email: email_addresses[0]?.email_address || "",
            firstName: first_name || "",
            lastName: last_name || "",
            imageUrl: image_url || "",
        });
    }

    if (eventType === "user.deleted") {
        const { id } = payload.data;
        await ctx.runMutation(api.users.deleteUser, { clerkId: id! });
    }

    return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: clerkWebhook
});

export default http;














// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// const http = httpRouter();
// import { Webhook } from "svix";
// import { api } from "./_generated/api";
// import { WebhookEvent } from "@clerk/nextjs/server";

// // const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!; 
// // const convex = new ConvexHttpClient(convexUrl);
// // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// const clerkWebhook =httpAction(async (ctx, request) => {
//     const webhookSecret= process.env.CLERK_WEBHOOK_SECRET!;
//     if (!webhookSecret) {
// 		throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
// 	}

//     const svix_id = request.headers.get("svix-id");
// 	const svix_signature = request.headers.get("svix-signature");
// 	const svix_timestamp = request.headers.get("svix-timestamp");

//     if (!svix_id || !svix_signature || !svix_timestamp) {
// 		return new Response("Error occurred -- no svix headers", {
// 			status: 400,
// 		});
// 	}

//     const payload= await request.json();
//     const body = JSON.stringify(payload);

//     const wh= new Webhook(webhookSecret);

//     let evt: WebhookEvent;
    
//     try {
//         evt= wh.verify(body ,{
//             "svix-id":svix_id,
//             "svix-timestamp":svix_timestamp,
//             "svix-signature":svix_signature
//         }) as WebhookEvent
//     }catch (err) {
//         console.error("Error verifying webhook:", err);
// 		return new Response("Error occurred", { status: 400 });
//     }

//     const eventType = payload.type;

//     if (eventType === "user.created") {
//       const { id, email_addresses, first_name, last_name, image_url } = payload.data;
      
//       await ctx.runMutation(api.users.createUser, {
//         clerkId: id,
//         email: email_addresses[0]?.email_address || "",
//         firstName: first_name || "",
//         lastName: last_name || "",
//         imageUrl: image_url || "",
//         role: "user",
//       });
//     }


//     return new Response("Webhook processed successfully", { status: 200 });  
// })

// http.route({
//     path: "/clerk-webhook",
//     method: "POST",
//     handler:clerkWebhook
// })

// export default http;


