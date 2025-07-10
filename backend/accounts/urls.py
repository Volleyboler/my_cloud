from django.urls import path

from accounts.views import register_user, get_user_list, delete_user, user_login, user_logout, user_status_admin


urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('get-users', get_user_list, name='get_user_list'),
    path('delete/<int:user_id>', delete_user, name='delete_user'),
    path('login/', user_login, name='user_login'),
    path('logout', user_logout, name='user_logout'),
    path('status/<int:user_id>', user_status_admin, name='user_status_admin'),
]
