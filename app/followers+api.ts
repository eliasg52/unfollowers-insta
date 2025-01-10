import { IgApiClient } from 'instagram-private-api';
import { NextRequest, NextResponse } from 'expo-router/server';

const ig = new IgApiClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Configurar cliente de Instagram
    ig.state.generateDevice(username);
    await ig.account.login(username, password);

    // Obtener seguidores
    const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
    const followers = await followersFeed.items();

    return NextResponse.json({ followers: followers.map((f) => f.username) });
  } catch (error) {
    console.error('Error al obtener seguidores:', error);
    return NextResponse.json(
      { error: 'Error al obtener seguidores. Verifica tus credenciales.' },
      { status: 500 }
    );
  }
}
