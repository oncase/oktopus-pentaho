"use strict";

angular
  .module("portalApp.group-service", [])
  .service("groupService", [
    "config",
    "$http",
    function(config, $http) {
      var _self = this;
      var _roles = [];
      var _icons = [
        { name: "livro", icon: "book" },
        { name: "ferramenta", icon: "build" },
        { name: "banco", icon: "account_balance" },
        { name: "câmera", icon: "camera_enhanced" },
        { name: "telefone", icon: "phone_iphone" },
        { name: "curtida", icon: "thumb_up" },
        { name: "dinheiro", icon: "euro_symbol" },
        { name: "coração", icon: "favorite" },
        { name: "pessoa", icon: "face" },
        { name: "estrela", icon: "grade" },
        { name: "mouse", icon: "mouse" },
        { name: "casa", icon: "home" },
        { name: "fone", icon: "headset" },
        { name: "globo", icon: "language" },
        { name: "moto", icon: "motorcycle" },
        { name: "mão", icon: "pan_tool" },
        { name: "computador", icon: "computer" },
        { name: "música", icon: "music_note" },
        { name: "videogame", icon: "videogame_asset" },
        { name: "carrinho", icon: "shopping_cart" },
        { name: "tradução", icon: "translate" },
        { name: "mala", icon: "work" },
        { name: "pasta", icon: "folder" },
        { name: "nuvem", icon: "cloud" },
        { name: "segurança", icon: "security" },
        { name: "dispositivo", icon: "device_hub" },
        { name: "carteira", icon: "account_balance_wallet" },
        { name: "fogo", icon: "whatshot" }
      ];

      function _getAllICons() {
        return _icons;
      }

      function _fetchAllRoles() {
        var endpointUrl = config.BASE_URL + "api/userrolelist/allRoles";
        return $http.get(endpointUrl);
      }

      return {
        fetchAllRoles: _fetchAllRoles,
        getAllICons: _getAllICons
        // getAllRoles: _getAllRoles
      };
    }
  ]);
