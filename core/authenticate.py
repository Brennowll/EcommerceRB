from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import User
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import UntypedToken, TokenError


class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Acesse o access_token passado nos cookies da requisição
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None  # Nenhum access_token encontrado nos cookies, a autenticação falha

        try:
            # Decodifique o access_token usando SimpleJWT
            untokent = UntypedToken(access_token)
            user = User.objects.get(id=untokent.payload['user_id'])
        except TokenError:
            raise AuthenticationFailed('Token inválido ou expirado.')

        return user, None
