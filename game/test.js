// 角色對弈遊戲原型
class Game {
  constructor() {
    this.characters = [];
    this.initializeCharacters();
    this.playerA = {
      name: "玩家A",
      selectedCharacters: [],
      bannedCharacter: null,
      placedCharacters: new Array(8).fill().map(() => new Array(8).fill(null))
    };
    this.playerB = {
      name: "玩家B",
      selectedCharacters: [],
      bannedCharacter: null,
      placedCharacters: new Array(8).fill().map(() => new Array(8).fill(null))
    };
    this.currentPhase = "ban"; // ban, pick, placement, battle
    this.currentTurn = "playerA";
    this.gameBoard = new Array(8).fill().map(() => new Array(8).fill(null));
    this.battleTurn = 0;
  }

  initializeCharacters() {
    // 初始化12個角色
    this.characters = [
      {
        id: 1,
        name: "Selina",
        title: "無差鱉攻擊",
        hp: 800,
        attack: 120,
        position: "mid",
        skill: (self, allCharacters) => {
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            console.log(`${self.name} 使用無差鱉攻擊，隨機攻擊 ${target.name}！`);
            target.hp -= self.attack;
            return `${self.name} 變成一隻鱉，對 ${target.name} 造成 ${self.attack} 點傷害！`;
          }
          return `${self.name} 使用無差鱉攻擊，但沒有目標！`;
        }
      },
      {
        id: 2,
        name: "Vincent",
        title: "種族之力",
        hp: 900,
        attack: 150,
        position: "front",
        skill: (self, allCharacters) => {
          const frontEnemies = allCharacters.filter(c => 
            c.owner !== self.owner && 
            c.hp > 0 && 
            c.position === "front"
          );
          let damage = 0;
          if (frontEnemies.length > 0) {
            frontEnemies.forEach(enemy => {
              enemy.hp -= self.attack;
              damage += self.attack;
            });
            return `${self.name} 使用種族之力，對前排敵人造成總共 ${damage} 點傷害！`;
          }
          return `${self.name} 使用種族之力，但沒有前排敵人！`;
        }
      },
      {
        id: 3,
        name: "Lorenzo",
        title: "暗器牙籤",
        hp: 700,
        attack: 100,
        position: "back",
        skill: (self, allCharacters) => {
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          let damage = 0;
          if (enemies.length > 0) {
            const targets = [];
            for (let i = 0; i < Math.min(3, enemies.length); i++) {
              const randomIndex = Math.floor(Math.random() * enemies.length);
              const target = enemies[randomIndex];
              target.hp -= Math.floor(self.attack * 0.7);
              damage += Math.floor(self.attack * 0.7);
              targets.push(target.name);
              enemies.splice(randomIndex, 1);
            }
            return `${self.name} 使用暗器牙籤，對 ${targets.join(", ")} 造成總共 ${damage} 點傷害！`;
          }
          return `${self.name} 使用暗器牙籤，但沒有目標！`;
        }
      },
      {
        id: 4,
        name: "Bonnie",
        title: "兔子跳",
        hp: 650,
        attack: 80,
        position: "mid",
        skill: (self, allCharacters) => {
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.charmed = true;
            target.originalOwner = target.owner;
            target.owner = self.owner;
            return `${self.name} 使用兔子跳，魅惑了 ${target.name}，使其暫時為我方作戰！`;
          }
          return `${self.name} 使用兔子跳，但沒有目標！`;
        }
      },
      {
        id: 5,
        name: "Amelia",
        title: "電鑽攻擊",
        hp: 750,
        attack: 180,
        position: "front",
        skill: (self, allCharacters) => {
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[0]; // 攻擊最近的敵人
            const damage = self.attack * 1.5;
            target.hp -= damage;
            return `${self.name} 使用電鑽攻擊，對 ${target.name} 造成 ${damage} 點多段傷害！`;
          }
          return `${self.name} 使用電鑽攻擊，但沒有目標！`;
        }
      },
      {
        id: 6,
        name: "Ethan",
        title: "周一路就是俗辣",
        hp: 850,
        attack: 90,
        position: "mid",
        skill: (self, allCharacters) => {
          if (self.hp < self.maxHp * 0.3) {
            self.position = "back";
            const healing = Math.floor(self.maxHp * 0.2);
            self.hp += healing;
            return `${self.name} 使用周一路就是俗辣，退到後排並恢復 ${healing} 點生命值！`;
          }
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.hp -= self.attack;
            return `${self.name} 攻擊 ${target.name} 造成 ${self.attack} 點傷害！`;
          }
          return `${self.name} 攻擊，但沒有目標！`;
        }
      },
      {
        id: 7,
        name: "Ean",
        title: "暗影肥豬",
        hp: 1200,
        attack: 70,
        position: "front",
        skill: (self, allCharacters) => {
          if (self.hp < self.maxHp * 0.5 && !self.damageReduction) {
            self.damageReduction = true;
            return `${self.name} 使用暗影肥豬，獲得50%傷害減免！`;
          }
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[0]; // 攻擊最近的敵人
            target.hp -= self.attack;
            return `${self.name} 攻擊 ${target.name} 造成 ${self.attack} 點傷害！`;
          }
          return `${self.name} 攻擊，但沒有目標！`;
        }
      },
      {
        id: 8,
        name: "Andrew",
        title: "數學很好玩",
        hp: 700,
        attack: 110,
        position: "mid",
        skill: (self, allCharacters) => {
          if (!self.skillCooldown || self.skillCooldown <= 0) {
            const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
            if (enemies.length > 0) {
              const target = enemies[Math.floor(Math.random() * enemies.length)];
              target.stunned = 2; // 暈眩2回合
              self.skillCooldown = 3; // 技能冷卻3回合
              return `${self.name} 使用數學很好玩，變身瘋狂Josh，使 ${target.name} 暈眩2回合！`;
            }
            return `${self.name} 使用數學很好玩，但沒有目標！`;
          } else {
            self.skillCooldown--;
            const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
            if (enemies.length > 0) {
              const target = enemies[Math.floor(Math.random() * enemies.length)];
              target.hp -= self.attack;
              return `${self.name} 技能冷卻中，攻擊 ${target.name} 造成 ${self.attack} 點傷害！`;
            }
            return `${self.name} 技能冷卻中，攻擊，但沒有目標！`;
          }
        }
      },
      {
        id: 9,
        name: "Ian",
        title: "死亡小丑",
        hp: 850,
        attack: 100,
        position: "front",
        skill: (self, allCharacters) => {
          if (self.hp < self.maxHp * 0.2 && !self.physicalImmunity) {
            self.physicalImmunity = 2; // 物理免疫2回合
            return `${self.name} 使用死亡小丑，獲得2回合物理免疫！`;
          }
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.hp -= self.attack;
            return `${self.name} 攻擊 ${target.name} 造成 ${self.attack} 點傷害！`;
          }
          return `${self.name} 攻擊，但沒有目標！`;
        }
      },
      {
        id: 10,
        name: "Antony",
        title: "糖糖攻擊",
        hp: 780,
        attack: 95,
        position: "mid",
        skill: (self, allCharacters) => {
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            if (!target.sugarMarks) {
              target.sugarMarks = 0;
            }
            target.sugarMarks++;
            target.hp -= self.attack;
            let message = `${self.name} 使用糖糖攻擊，對 ${target.name} 造成 ${self.attack} 點傷害，並附加了1層印記！`;
            if (target.sugarMarks >= 5) {
              const explosionDamage = self.attack * 2;
              target.hp -= explosionDamage;
              target.sugarMarks = 0;
              message += `\n${target.name} 的5層印記爆炸，造成額外 ${explosionDamage} 點傷害！`;
            }
            return message;
          }
          return `${self.name} 使用糖糖攻擊，但沒有目標！`;
        }
      },
      {
        id: 11,
        name: "Kelvin",
        title: "巨型糖寶寶",
        hp: 1000,
        attack: 60,
        position: "front",
        skill: (self, allCharacters) => {
          if (!self.transformed) {
            self.transformed = true;
            self.hp = self.hp * 5;
            self.maxHp = self.maxHp * 5;
            return `${self.name} 使用巨型糖寶寶，血量提升至 ${self.hp}！`;
          }
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.hp -= self.attack;
            return `${self.name} 攻擊 ${target.name} 造成 ${self.attack} 點傷害！`;
          }
          return `${self.name} 攻擊，但沒有目標！`;
        }
      },
      {
        id: 12,
        name: "Emily",
        title: "我們都是臭婊",
        hp: 730,
        attack: 105,
        position: "back",
        skill: (self, allCharacters) => {
          const enemies = allCharacters.filter(c => c.owner !== self.owner && c.hp > 0);
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.charmed = true;
            target.attackReduction = 0.5; // 攻擊力降低50%
            target.originalOwner = target.owner;
            target.owner = self.owner;
            return `${self.name} 使用我們都是臭婊，使 ${target.name} 轉為己方，並降低其50%攻擊力！`;
          }
          return `${self.name} 使用我們都是臭婊，但沒有目標！`;
        }
      }
    ];
  }

  // 禁用階段
  banCharacter(player, characterId) {
    if (this.currentPhase !== "ban") {
      throw new Error("現在不是禁用階段!");
    }
    if (this.currentTurn !== player) {
      throw new Error("現在不是您的回合!");
    }
    
    const character = this.characters.find(c => c.id === characterId);
    if (!character) {
      throw new Error("角色不存在!");
    }
    
    if (player === "playerA") {
      this.playerA.bannedCharacter = character;
      this.currentTurn = "playerB";
      } else {
      this.playerB.bannedCharacter = character;
      this.currentPhase = "pick"; // 禁用階段結束，進入選擇階段
      this.currentTurn = "playerA"; // 玩家A先選角色
    }
    
    return `${player === "playerA" ? this.playerA.name : this.playerB.name} 禁用了角色 ${character.name}!`;
  }

  // 選擇階段
  pickCharacter(player, characterId) {
    if (this.currentPhase !== "pick") {
      throw new Error("現在不是選擇階段!");
    }
    if (this.currentTurn !== player) {
      throw new Error("現在不是您的回合!");
    }
    
    const character = this.characters.find(c => c.id === characterId);
    if (!character) {
      throw new Error("角色不存在!");
    }
    
    // 檢查角色是否已被禁用或選擇
    if (
      (this.playerA.bannedCharacter && this.playerA.bannedCharacter.id === characterId) ||
      (this.playerB.bannedCharacter && this.playerB.bannedCharacter.id === characterId) ||
      this.playerA.selectedCharacters.some(c => c.id === characterId) ||
      this.playerB.selectedCharacters.some(c => c.id === characterId)
    ) {
      throw new Error("該角色已被禁用或選擇!");
    }
    
    // 進行選擇並更新回合
    if (player === "playerA") {
      this.playerA.selectedCharacters.push({...character, owner: "playerA", maxHp: character.hp});
      
      // 蛇形選角邏輯
      if (this.playerA.selectedCharacters.length < 2) {
        this.currentTurn = "playerB";
      } else if (this.playerA.selectedCharacters.length === 2) {
        if (this.playerB.selectedCharacters.length < 2) {
          this.currentTurn = "playerB";
        } else {
          this.currentTurn = "playerA";
        }
      } else if (this.playerA.selectedCharacters.length === 3) {
        this.currentTurn = "playerB";
      } else if (this.playerA.selectedCharacters.length === 4) {
        if (this.playerB.selectedCharacters.length < 4) {
          this.currentTurn = "playerB";
        } else {
          // 選角階段結束
          this.currentPhase = "placement";
          this.currentTurn = "both"; // 雙方同時進行佈置
        }
      }
    } else { // playerB
      this.playerB.selectedCharacters.push({...character, owner: "playerB", maxHp: character.hp});
      
      // 蛇形選角邏輯
      if (this.playerB.selectedCharacters.length < 2) {
        this.currentTurn = "playerA";
      } else if (this.playerB.selectedCharacters.length === 2) {
        if (this.playerA.selectedCharacters.length < 2) {
          this.currentTurn = "playerA";
        } else {
          this.currentTurn = "playerB";
        }
      } else if (this.playerB.selectedCharacters.length === 3) {
        this.currentTurn = "playerA";
      } else if (this.playerB.selectedCharacters.length === 4) {
        if (this.playerA.selectedCharacters.length < 4) {
          this.currentTurn = "playerA";
        } else {
          // 選角階段結束
          this.currentPhase = "placement";
          this.currentTurn = "both"; // 雙方同時進行佈置
        }
      }
    }
    
    return `${player === "playerA" ? this.playerA.name : this.playerB.name} 選擇了角色 ${character.name}!`;
  }

  // 佈置階段
  placeCharacter(player, characterIndex, row, col) {
    if (this.currentPhase !== "placement") {
      throw new Error("現在不是佈置階段!");
    }
    
    // 確認是選擇的角色
    const playerObj = player === "playerA" ? this.playerA : this.playerB;
    if (characterIndex < 0 || characterIndex >= playerObj.selectedCharacters.length) {
      throw new Error("角色索引無效!");
    }
    
    // 確認位置有效
    if (row < 0 || row >= 8 || col < 0 || col >= 8) {
      throw new Error("位置無效!");
    }
    
    // 檢查位置是否已被佔用
    if (playerObj.placedCharacters[row][col] !== null) {
      throw new Error("該位置已被佔用!");
    }
    
    // 佈置角色
    const character = playerObj.selectedCharacters[characterIndex];
    playerObj.placedCharacters[row][col] = character;
    
    // 檢查是否所有角色都已佈置
    let allPlaced = true;
    
    // 檢查玩家A
    let placedCountA = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.playerA.placedCharacters[r][c] !== null) {
          placedCountA++;
        }
      }
    }
    
    // 檢查玩家B
    let placedCountB = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.playerB.placedCharacters[r][c] !== null) {
          placedCountB++;
        }
      }
    }
    
    if (placedCountA < this.playerA.selectedCharacters.length || 
        placedCountB < this.playerB.selectedCharacters.length) {
      allPlaced = false;
    }
    
    // 如果所有角色都已佈置，進入戰鬥階段
    if (allPlaced) {
      this.initializeBattle();
      this.currentPhase = "battle";
    }
    
    return `${player === "playerA" ? this.playerA.name : this.playerB.name} 將 ${character.name} 佈置在位置 (${row}, ${col})!`;
  }

  // 初始化戰鬥
  initializeBattle() {
    // 合併雙方的佈置到遊戲版圖
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.playerA.placedCharacters[r][c] !== null) {
          // 設置位置信息
          const character = this.playerA.placedCharacters[r][c];
          character.gridRow = r;
          character.gridCol = c;
          if (r < 3) character.position = "front";
          else if (r < 6) character.position = "mid";
          else character.position = "back";
          
          this.gameBoard[r][c] = character;
        }
        
        if (this.playerB.placedCharacters[r][c] !== null) {
          // 設置位置信息
          const character = this.playerB.placedCharacters[r][c];
          character.gridRow = r;
          character.gridCol = c;
          if (r < 3) character.position = "front";
          else if (r < 6) character.position = "mid";
          else character.position = "back";
          
          this.gameBoard[r][c] = character;
        }
      }
    }
    
    // 重置回合計數
    this.battleTurn = 0;
  }

  // 執行戰鬥回合
  executeBattleTurn() {
    if (this.currentPhase !== "battle") {
      throw new Error("現在不是戰鬥階段!");
    }
    
    this.battleTurn++;
    console.log(`===== 回合 ${this.battleTurn} =====`);
    
    // 獲取所有存活角色
    const allCharacters = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.gameBoard[r][c] !== null && this.gameBoard[r][c].hp > 0) {
          allCharacters.push(this.gameBoard[r][c]);
        }
      }
    }
    
    // 戰鬥日誌
    const battleLog = [];
    
    // 處理回合開始時的效果
    for (const character of allCharacters) {
      // 減少暈眩回合
      if (character.stunned > 0) {
        character.stunned--;
        battleLog.push(`${character.name} 暈眩中，剩餘 ${character.stunned} 回合`);
        continue;
      }
      
      // 減少物理免疫回合
      if (character.physicalImmunity > 0) {
        character.physicalImmunity--;
        if (character.physicalImmunity === 0) {
          battleLog.push(`${character.name} 的物理免疫效果消失`);
        } else {
          battleLog.push(`${character.name} 的物理免疫效果剩餘 ${character.physicalImmunity} 回合`);
        }
      }
      
      // 回復魅惑效果
      if (character.charmed) {
        character.charmed = false;
        character.owner = character.originalOwner;
        battleLog.push(`${character.name} 魅惑效果消失，回到 ${character.owner} 方`);
      }
    }
    
    // 執行每個角色的技能
    for (const character of allCharacters) {
      // 跳過暈眩中的角色
      if (character.stunned > 0) continue;
      
      // 使用技能
      const skillResult = character.skill(character, allCharacters);
      battleLog.push(skillResult);
    }
    
    // 檢查戰鬥結束條件
    const playerACharacters = allCharacters.filter(c => c.owner === "playerA" && c.hp > 0);
    const playerBCharacters = allCharacters.filter(c => c.owner === "playerB" && c.hp > 0);
    
    if (playerACharacters.length === 0 || playerBCharacters.length === 0) {
      this.currentPhase = "end";
      if (playerACharacters.length === 0 && playerBCharacters.length === 0) {
        battleLog.push("戰鬥結束，雙方平局!");
      } else if (playerACharacters.length === 0) {
        battleLog.push(`戰鬥結束，${this.playerB.name} 獲勝!`);
      } else {
        battleLog.push(`戰鬥結束，${this.playerA.name} 獲勝!`);
      }
    } else if (this.battleTurn >= 20) { // 設置最大回合數
      this.currentPhase = "end";
      if (playerACharacters.length > playerBCharacters.length) {
        battleLog.push(`回合數達到上限，${this.playerA.name} 獲勝!`);
      } else if (playerBCharacters.length > playerACharacters.length) {
        battleLog.push(`回合數達到上限，${this.playerB.name} 獲勝!`);
      } else {
        battleLog.push("回合數達到上限，雙方平局!");
      }
    }
    
    return battleLog;
  }

  // 獲取當前遊戲狀態
  getGameState() {
    return {
      phase: this.currentPhase,
      turn: this.currentTurn,
      playerA: {
        name: this.playerA.name,
        bannedCharacter: this.playerA.bannedCharacter ? this.playerA.bannedCharacter.name : null,
        selectedCharacters: this.playerA.selectedCharacters.map(c => ({ 
          name: c.name, 
          hp: c.hp, 
          maxHp: c.maxHp 
        }))
      },
      playerB: {
        name: this.playerB.name,
        bannedCharacter: this.playerB.bannedCharacter ? this.playerB.bannedCharacter.name : null,
        selectedCharacters: this.playerB.selectedCharacters.map(c => ({ 
          name: c.name, 
          hp: c.hp,
          maxHp: c.maxHp
        }))
      },
      battleTurn: this.battleTurn,
      gameBoard: this.gameBoard.map(row => 
        row.map(cell => cell ? { 
          name: cell.name, 
          owner: cell.owner, 
          hp: cell.hp,
          maxHp: cell.maxHp
        } : null)
      )
    };
  }

  // 重置遊戲
  resetGame() {
    this.playerA.selectedCharacters = [];
    this.playerA.bannedCharacter = null;
    this.playerA.placedCharacters = new Array(8).fill().map(() => new Array(8).fill(null));
    
    this.playerB.selectedCharacters = [];
    this.playerB.bannedCharacter = null;
    this.playerB.placedCharacters = new Array(8).fill().map(() => new Array(8).fill(null));
    
    this.currentPhase = "ban";
    this.currentTurn = "playerA";
    this.gameBoard = new Array(8).fill().map(() => new Array(8).fill(null));
    this.battleTurn = 0;
    
    return "遊戲已重置!";
  }
}

// 遊戲界面 (簡單的命令行界面)
class GameUI {
  constructor() {
    this.game = new Game();
  }

  // 顯示可用角色
  showAvailableCharacters() {
    console.log("=== 可用角色 ===");
    const bannedIds = [
      this.game.playerA.bannedCharacter?.id,
      this.game.playerB.bannedCharacter?.id
    ];
    
    const selectedIds = [
      ...this.game.playerA.selectedCharacters.map(c => c.id),
      ...this.game.playerB.selectedCharacters.map(c => c.id)
    ];
    
    this.game.characters.forEach(character => {
      if (!bannedIds.includes(character.id) && !selectedIds.includes(character.id)) {
console.log(`ID: ${character.id}, 名稱: ${character.name}, 稱號: ${character.title}, 生命: ${character.hp}, 攻擊: ${character.attack}, 位置: ${character.position}`);
      }
    });
  }

  // 顯示遊戲狀態
  showGameState() {
    const state = this.game.getGameState();
    console.log(`=== 當前階段: ${state.phase} ===`);
    console.log(`當前回合: ${state.turn}`);
    
    console.log(`\n=== ${state.playerA.name} ===`);
    console.log(`禁用角色: ${state.playerA.bannedCharacter || "無"}`);
    console.log("選擇角色:");
    state.playerA.selectedCharacters.forEach((c, index) => {
      console.log(`  ${index + 1}. ${c.name} (HP: ${c.hp}/${c.maxHp})`);
    });
    
    console.log(`\n=== ${state.playerB.name} ===`);
    console.log(`禁用角色: ${state.playerB.bannedCharacter || "無"}`);
    console.log("選擇角色:");
    state.playerB.selectedCharacters.forEach((c, index) => {
      console.log(`  ${index + 1}. ${c.name} (HP: ${c.hp}/${c.maxHp})`);
    });
    
    if (state.phase === "battle" || state.phase === "end") {
      console.log(`\n=== 戰鬥回合: ${state.battleTurn} ===`);
      console.log("遊戲棋盤:");
      for (let r = 0; r < 8; r++) {
        let rowStr = "";
        for (let c = 0; c < 8; c++) {
          const cell = state.gameBoard[r][c];
          if (cell) {
            rowStr += `[${cell.owner === "playerA" ? "A" : "B"}:${cell.name.substring(0, 3)}] `;
          } else {
            rowStr += "[     ] ";
          }
        }
        console.log(rowStr);
      }
    }
  }

  // 執行遊戲命令
  executeCommand(command, ...args) {
    try {
      switch (command) {
        case "ban":
          return this.game.banCharacter(args[0], parseInt(args[1]));
        case "pick":
          return this.game.pickCharacter(args[0], parseInt(args[1]));
        case "place":
          return this.game.placeCharacter(args[0], parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
        case "battle":
          return this.game.executeBattleTurn().join("\n");
        case "reset":
          return this.game.resetGame();
        case "show":
          this.showGameState();
          return "遊戲狀態已顯示";
        case "characters":
          this.showAvailableCharacters();
          return "可用角色已顯示";
        default:
          return "未知命令";
      }
    } catch (error) {
      return `錯誤: ${error.message}`;
    }
  }
}

// 遊戲前端界面
class GameFrontend {
  constructor() {
    this.gameUI = new GameUI();
    this.initializeUI();
  }

  initializeUI() {
    // 建立前端界面
    // 這裡只是示意，實際應用中需要創建HTML元素並添加到DOM
    console.log("=== 角色對弈遊戲 ===");
    console.log("遊戲已啟動，請使用命令操作");
    console.log("使用 'ban playerA/playerB 角色ID' 來禁用角色");
    console.log("使用 'pick playerA/playerB 角色ID' 來選擇角色");
    console.log("使用 'place playerA/playerB 角色索引 行 列' 來佈置角色");
    console.log("使用 'battle' 來執行戰鬥回合");
    console.log("使用 'show' 來顯示遊戲狀態");
    console.log("使用 'characters' 來顯示可用角色");
    console.log("使用 'reset' 來重置遊戲");
    
    // 顯示初始狀態
    this.gameUI.showGameState();
    this.gameUI.showAvailableCharacters();
  }

  // 處理用戶輸入
  handleInput(input) {
    const parts = input.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    
    const result = this.gameUI.executeCommand(command, ...args);
    console.log(result);
    
    // 如果命令執行後需要更新界面，可以在這裡添加
    if (["ban", "pick", "place", "battle", "reset"].includes(command)) {
      this.gameUI.showGameState();
    }
  }
}

// 示例: 創建一個遊戲實例
const gameFrontend = new GameFrontend();

// 示例: 模擬一個簡單的遊戲流程
// 禁用角色
gameFrontend.handleInput("ban playerA 1");  // 玩家A禁用Selina
gameFrontend.handleInput("ban playerB 12"); // 玩家B禁用Emily

// 選擇角色 (蛇形選擇)
gameFrontend.handleInput("pick playerA 2");  // 玩家A選擇Vincent
gameFrontend.handleInput("pick playerB 3");  // 玩家B選擇Lorenzo
gameFrontend.handleInput("pick playerB 4");  // 玩家B選擇Bonnie
gameFrontend.handleInput("pick playerA 5");  // 玩家A選擇Amelia
gameFrontend.handleInput("pick playerA 6");  // 玩家A選擇Ethan
gameFrontend.handleInput("pick playerB 7");  // 玩家B選擇Ean
gameFrontend.handleInput("pick playerB 8");  // 玩家B選擇Andrew
gameFrontend.handleInput("pick playerA 9");  // 玩家A選擇Ian

// 佈置角色
gameFrontend.handleInput("place playerA 0 0 0"); // 玩家A佈置Vincent在(0,0)
gameFrontend.handleInput("place playerA 1 1 1"); // 玩家A佈置Amelia在(1,1)
gameFrontend.handleInput("place playerA 2 2 2"); // 玩家A佈置Ethan在(2,2)
gameFrontend.handleInput("place playerA 3 3 3"); // 玩家A佈置Ian在(3,3)

gameFrontend.handleInput("place playerB 0 4 4"); // 玩家B佈置Lorenzo在(4,4)
gameFrontend.handleInput("place playerB 1 5 5"); // 玩家B佈置Bonnie在(5,5)
gameFrontend.handleInput("place playerB 2 6 6"); // 玩家B佈置Ean在(6,6)
gameFrontend.handleInput("place playerB 3 7 7"); // 玩家B佈置Andrew在(7,7)

// 執行戰鬥
gameFrontend.handleInput("battle"); // 執行第一回合戰鬥
gameFrontend.handleInput("battle"); // 執行第二回合戰鬥
gameFrontend.handleInput("battle"); // 執行第三回合戰鬥

// 重置遊戲
// gameFrontend.handleInput("reset");
