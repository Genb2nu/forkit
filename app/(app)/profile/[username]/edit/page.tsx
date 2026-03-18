interface EditProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { username } = await params;

  return (
    <div className="min-h-screen bg-bg-base text-cream p-4">
      <h1 className="text-2xl font-display font-bold">Edit Profile</h1>
      <p className="text-text-2 mt-2">
        Edit profile for @{username} — coming in Phase 2.
      </p>
    </div>
  );
}
