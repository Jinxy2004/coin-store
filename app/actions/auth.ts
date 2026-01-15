"use server";
import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  // Inserts the users data into the table and returns it
  const data = await prisma.users.create({
    data: {
      username: validatedFields.data.name,
      email: validatedFields.data.email,
      password: hashedPassword,
    },
  });

  // Check to make sure the account was successfully created
  const user = data.username;
  if (!user) {
    return {
      message: "An error occured while creating your account.",
    };
  }

  // Call the provider or db to create a user...
  await createSession(data.username);

  redirect("/profile");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
