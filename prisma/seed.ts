import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const USERS = [
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@blabla.com',
    password: 'password123',
    bio: 'Tech enthusiast | Coffee lover ☕ | Building cool stuff',
    location: 'Mumbai, India',
    website: 'https://johndoe.dev',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    name: 'Sarah Wilson',
    username: 'sarahwilson',
    email: 'sarah@blabla.com',
    password: 'password123',
    bio: 'Designer 🎨 | Traveler ✈️ | Photography enthusiast',
    location: 'Delhi, India',
    website: 'https://sarahdesigns.com',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    name: 'Mike Chen',
    username: 'mikechen',
    email: 'mike@blabla.com',
    password: 'password123',
    bio: 'Software Engineer @ Tech Corp | Open Source Contributor',
    location: 'Bangalore, India',
    website: 'https://mikechen.io',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
  {
    name: 'Priya Sharma',
    username: 'priyasharma',
    email: 'priya@blabla.com',
    password: 'password123',
    bio: 'Product Manager | Fitness enthusiast 💪 | Bookworm 📚',
    location: 'Pune, India',
    verified: false,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    name: 'Alex Rodriguez',
    username: 'alexrodriguez',
    email: 'alex@blabla.com',
    password: 'password123',
    bio: 'Entrepreneur | Startup Founder | Mentor',
    location: 'Hyderabad, India',
    website: 'https://alexstartup.com',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    name: 'Emma Thompson',
    username: 'emmathompson',
    email: 'emma@blabla.com',
    password: 'password123',
    bio: 'Content Creator | Food Blogger 🍕 | Dog mom 🐕',
    location: 'Chennai, India',
    website: 'https://emmaeats.blog',
    verified: false,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
  {
    name: 'Rahul Kumar',
    username: 'rahulkumar',
    email: 'rahul@blabla.com',
    password: 'password123',
    bio: 'Data Scientist | AI/ML Expert | Tech Speaker',
    location: 'Kolkata, India',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  },
  {
    name: 'Lisa Anderson',
    username: 'lisaanderson',
    email: 'lisa@blabla.com',
    password: 'password123',
    bio: 'Marketing Strategist | Brand Builder | Coffee addict ☕',
    location: 'Ahmedabad, India',
    verified: false,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
  {
    name: 'David Lee',
    username: 'davidlee',
    email: 'david@blabla.com',
    password: 'password123',
    bio: 'Full Stack Developer | Tech Blogger | Gamer 🎮',
    location: 'Jaipur, India',
    website: 'https://davidcodes.dev',
    verified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
  {
    name: 'Anjali Patel',
    username: 'anjalipatel',
    email: 'anjali@blabla.com',
    password: 'password123',
    bio: 'UX Researcher | Design Thinking | Psychology',
    location: 'Surat, India',
    verified: false,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
  },
];

const POSTS = [
  "Just launched my new project! 🚀 Check it out at my website!",
  "Beautiful sunrise this morning 🌅 #morningvibes",
  "Coffee is the answer, no matter what the question is ☕",
  "Working on something exciting! Stay tuned... 👀",
  "Great meeting with the team today. Innovation at its best! 💡",
  "Weekend vibes! Time to relax and recharge 🌴",
  "New blog post is live! Link in bio 📝",
  "Just finished an amazing book. Highly recommended! 📚",
  "Coding late into the night... the best time to be creative 💻",
  "Grateful for all the support from this amazing community! 🙏",
  "Travel tip: Always carry a power bank! 🔋",
  "Today's workout was intense! Feeling energized 💪",
  "Trying out a new recipe today. Wish me luck! 🍳",
  "The future of AI is fascinating! #technology #AI",
  "Startup life: 90% hustle, 10% coffee breaks ☕",
  "Just deployed to production... fingers crossed! 🤞",
  "Best investment you can make is in yourself 📈",
  "Nature is the best therapy 🌿 #naturelover",
  "Code review time! Learning so much from the team 👨‍💻",
  "Friday feeling! Who's ready for the weekend? 🎉",
  "Attended an amazing conference today! Mind = blown 🤯",
  "New design project in the works 🎨 #designer",
  "Remember to take breaks. Your mental health matters! 🧘",
  "Just hit a new milestone! Thank you all! 🎯",
  "Rainy days call for hot chai and good books ☔📖",
  "Collaboration > Competition. Always! 🤝",
  "Late night thoughts: What if we could... 🤔",
  "Productivity hack: Pomodoro technique works wonders! ⏰",
  "Supporting local businesses today! 🛍️",
  "The best code is no code at all 😄 #programming",
];

const COMMENTS = [
  "Great post! 👏",
  "This is amazing!",
  "Love this! ❤️",
  "So true!",
  "Thanks for sharing!",
  "Couldn't agree more!",
  "Absolutely! 💯",
  "This made my day!",
  "Inspiring! 🌟",
  "Keep it up!",
  "Well said!",
  "Interesting perspective!",
  "I needed this today!",
  "Facts! 🔥",
  "This is gold!",
];

const MESSAGES = [
  "Hey! How are you doing?",
  "Did you see the latest update?",
  "Thanks for the recommendation!",
  "Let's catch up soon!",
  "Great work on the project!",
  "Are you free for a call tomorrow?",
  "Just wanted to say hi! 👋",
  "Check out this article I found",
  "Congrats on your achievement!",
  "Would love to collaborate!",
  "Your latest post was amazing!",
  "Happy birthday! 🎂",
  "Thanks for your help!",
  "Looking forward to working together!",
  "Hope you're having a great day!",
];

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data (optional - be careful in production!)
  console.log('🗑️  Clearing existing data...');
  await prisma.messageReaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.mention.deleteMany();
  await prisma.repost.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.postHashtag.deleteMany();
  await prisma.hashtag.deleteMany();
  await prisma.media.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared existing data\n');

  // Create users
  console.log('👥 Creating users...');
  const createdUsers = [];
  for (const userData of USERS) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password, ...userDataWithoutPassword } = userData;
    const user = await prisma.user.create({
      data: {
        ...userDataWithoutPassword,
        passwordHash: hashedPassword,
        emailVerified: new Date(),
        onboardingComplete: true,
      },
    });
    createdUsers.push(user);
    console.log(`   ✓ Created user: @${user.username}`);
  }
  console.log(`✅ Created ${createdUsers.length} users\n`);

  // Create follow relationships
  console.log('🔗 Creating follow relationships...');
  let followCount = 0;
  for (let i = 0; i < createdUsers.length; i++) {
    for (let j = 0; j < createdUsers.length; j++) {
      if (i !== j && Math.random() > 0.5) {
        await prisma.follow.create({
          data: {
            followerId: createdUsers[i].id,
            followeeId: createdUsers[j].id,
          },
        });
        followCount++;
      }
    }
  }
  console.log(`✅ Created ${followCount} follow relationships\n`);

  // Create posts
  console.log('📝 Creating posts...');
  const createdPosts = [];
  for (const user of createdUsers) {
    const numPosts = Math.floor(Math.random() * 5) + 2; // 2-6 posts per user
    for (let i = 0; i < numPosts; i++) {
      const content = POSTS[Math.floor(Math.random() * POSTS.length)];
      const post = await prisma.post.create({
        data: {
          content,
          authorId: user.id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        },
      });
      createdPosts.push(post);
    }
  }
  console.log(`✅ Created ${createdPosts.length} posts\n`);

  // Create likes
  console.log('❤️  Creating likes...');
  let likeCount = 0;
  for (const post of createdPosts) {
    const numLikes = Math.floor(Math.random() * 5); // 0-4 likes
    const likers = createdUsers
      .filter(u => u.id !== post.authorId)
      .sort(() => 0.5 - Math.random())
      .slice(0, numLikes);
    
    for (const liker of likers) {
      await prisma.like.create({
        data: {
          userId: liker.id,
          postId: post.id,
        },
      });
      likeCount++;
    }
  }
  console.log(`✅ Created ${likeCount} likes\n`);

  // Create comments
  console.log('💬 Creating comments...');
  let commentCount = 0;
  for (const post of createdPosts) {
    const numComments = Math.floor(Math.random() * 3); // 0-2 comments
    const commenters = createdUsers
      .filter(u => u.id !== post.authorId)
      .sort(() => 0.5 - Math.random())
      .slice(0, numComments);
    
    for (const commenter of commenters) {
      await prisma.comment.create({
        data: {
          content: COMMENTS[Math.floor(Math.random() * COMMENTS.length)],
          authorId: commenter.id,
          postId: post.id,
        },
      });
      commentCount++;
    }
  }
  console.log(`✅ Created ${commentCount} comments\n`);

  // Create bookmarks
  console.log('🔖 Creating bookmarks...');
  let bookmarkCount = 0;
  for (const user of createdUsers) {
    const numBookmarks = Math.floor(Math.random() * 3); // 0-2 bookmarks
    const bookmarkedPosts = createdPosts
      .filter(p => p.authorId !== user.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numBookmarks);
    
    for (const post of bookmarkedPosts) {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
      bookmarkCount++;
    }
  }
  console.log(`✅ Created ${bookmarkCount} bookmarks\n`);

  // Create conversations and messages
  console.log('💌 Creating conversations and messages...');
  let conversationCount = 0;
  let messageCount = 0;
  
  for (let i = 0; i < createdUsers.length; i++) {
    for (let j = i + 1; j < createdUsers.length; j++) {
      if (Math.random() > 0.6) { // 40% chance of conversation between any two users
        const user1 = createdUsers[i];
        const user2 = createdUsers[j];
        
        // Ensure user1Id < user2Id for consistency
        const [smallerId, largerId] = [user1.id, user2.id].sort();
        
        const conversation = await prisma.conversation.create({
          data: {
            user1Id: smallerId,
            user2Id: largerId,
          },
        });
        conversationCount++;
        
        // Create 2-5 messages
        const numMessages = Math.floor(Math.random() * 4) + 2;
        for (let k = 0; k < numMessages; k++) {
          const sender = k % 2 === 0 ? user1 : user2;
          const receiver = k % 2 === 0 ? user2 : user1;
          
          const message = await prisma.message.create({
            data: {
              conversationId: conversation.id,
              senderId: sender.id,
              receiverId: receiver.id,
              content: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
              read: Math.random() > 0.3, // 70% read
              createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Random time in last 3 days
            },
          });
          messageCount++;
          
          // Add some message reactions
          if (Math.random() > 0.7) { // 30% chance of reaction
            const emojis = ['❤️', '😂', '😮', '👍', '🔥'];
            await prisma.messageReaction.create({
              data: {
                messageId: message.id,
                userId: receiver.id,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
              },
            });
          }
        }
        
        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
      }
    }
  }
  console.log(`✅ Created ${conversationCount} conversations`);
  console.log(`✅ Created ${messageCount} messages\n`);

  // Create some reposts
  console.log('🔄 Creating reposts...');
  let repostCount = 0;
  for (const user of createdUsers) {
    const numReposts = Math.floor(Math.random() * 2); // 0-1 reposts
    const repostedPosts = createdPosts
      .filter(p => p.authorId !== user.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numReposts);
    
    for (const post of repostedPosts) {
      await prisma.repost.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
      repostCount++;
    }
  }
  console.log(`✅ Created ${repostCount} reposts\n`);

  console.log('🎉 Database seeding completed!\n');
  
  console.log('═'.repeat(60));
  console.log('📋 SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Users created:        ${createdUsers.length}`);
  console.log(`Posts created:        ${createdPosts.length}`);
  console.log(`Likes created:        ${likeCount}`);
  console.log(`Comments created:     ${commentCount}`);
  console.log(`Bookmarks created:    ${bookmarkCount}`);
  console.log(`Follows created:      ${followCount}`);
  console.log(`Reposts created:      ${repostCount}`);
  console.log(`Conversations:        ${conversationCount}`);
  console.log(`Messages:             ${messageCount}`);
  console.log('═'.repeat(60));
  
  console.log('\n🔑 LOGIN CREDENTIALS');
  console.log('═'.repeat(60));
  console.log('You can log in as any of these users:');
  console.log('Password for all users: password123\n');
  
  console.log('Featured User (Verified):');
  console.log(`  Email:    ${USERS[0].email}`);
  console.log(`  Username: ${USERS[0].username}`);
  console.log(`  Password: password123`);
  console.log(`  Name:     ${USERS[0].name}\n`);
  
  console.log('Other users:');
  USERS.slice(1).forEach((user, index) => {
    console.log(`  ${index + 2}. @${user.username} (${user.email}) - ${user.verified ? '✓ Verified' : 'Not verified'}`);
  });
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });