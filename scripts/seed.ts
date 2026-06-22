import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Anti Gravity 2.0 database...\n');

  // ==========================================
  // 1. Create Super Admin
  // ==========================================
  const adminEmail = 'admin@antigravity.com';
  const adminPassword = 'admin123';
  
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
    });
    console.log(`✅ Super Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`⏭️  Super Admin already exists`);
  }

  // ==========================================
  // 2. Site Settings
  // ==========================================
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Anti Gravity 2.0',
      siteTagline: 'AI-Powered Blogging Platform',
      adminEmail: adminEmail,
      aiProvider: 'openai',
      aiApiKey: '',
      aiModel: 'gpt-4o-mini',
      seoTitle: 'Anti Gravity 2.0 | AI-Powered Blog',
      seoDescription: 'Advanced AI-Powered Blogging Platform with Auto-Publishing and Smart Lead Generation',
    },
  });
  console.log('✅ Site Settings configured');

  // ==========================================
  // 3. Auto-Blog Settings
  // ==========================================
  await prisma.autoBlogSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      isActive: false,
      frequency: 'daily',
      maxPostsPerRun: 1,
      maxPostsPerDay: 5,
      imageSource: 'unsplash',
      autoPublish: true,
    },
  });
  console.log('✅ Auto-Blog Settings configured');

  // ==========================================
  // 4. Sample Tags
  // ==========================================
  const tags = ['AI', 'Technology', 'Automation', 'Business', 'Marketing', 'Tutorial', 'News', 'Productivity'];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.toLowerCase() },
      update: {},
      create: {
        name: tag,
        slug: tag.toLowerCase(),
      },
    });
  }
  console.log(`✅ ${tags.length} Tags created`);

  // ==========================================
  // 5. Sample Blog Posts
  // ==========================================
  const samplePosts = [
    {
      title: 'How AI is Revolutionizing Content Creation in 2025',
      slug: 'ai-revolutionizing-content-creation-2025',
      content: `<h2>The Rise of AI-Powered Content</h2>
<p>Artificial Intelligence has fundamentally changed how we create, distribute, and consume content. From automated article generation to intelligent editing tools, AI is making content creation faster, smarter, and more accessible than ever before.</p>

<h3>Key Trends in AI Content Creation</h3>
<ul>
<li><strong>Auto-Generated Articles:</strong> AI can now produce high-quality, SEO-optimized articles in seconds.</li>
<li><strong>Smart Editing:</strong> AI-powered editors can improve tone, grammar, and readability automatically.</li>
<li><strong>Content Personalization:</strong> AI tailors content to individual reader preferences.</li>
<li><strong>Visual Content Generation:</strong> AI creates images, infographics, and videos from text prompts.</li>
</ul>

<h3>The Future of Blogging</h3>
<p>With platforms like Anti Gravity 2.0, bloggers can leverage AI to automate their entire content pipeline — from keyword research to article generation to publishing. This doesn't replace human creativity; it amplifies it.</p>

<h2>Getting Started with AI Blogging</h2>
<p>The best approach is to use AI as an assistant, not a replacement. Let AI handle the heavy lifting of research, drafting, and SEO optimization, while you focus on adding your unique perspective and expertise.</p>

<p>Whether you're a solo blogger or running a content team, AI tools can help you produce more content, reach more readers, and grow your audience faster than ever before.</p>`,
      excerpt: 'Discover how AI is transforming the content creation landscape and what it means for bloggers and content creators.',
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
      status: 'Published',
      publishedAt: new Date(),
      seoTitle: 'How AI is Revolutionizing Content Creation | Anti Gravity Blog',
      seoDescription: 'Learn about the latest AI content creation trends and how to leverage them for your blog.',
      seoKeywords: 'AI content creation, AI blogging, automated content, SEO optimization',
      tags: ['AI', 'Technology'],
    },
    {
      title: '10 Proven Strategies to Generate Leads from Your Blog',
      slug: '10-strategies-generate-leads-blog',
      content: `<h2>Turn Your Blog into a Lead Generation Machine</h2>
<p>Your blog isn't just a platform for sharing ideas — it's one of the most powerful lead generation tools available. With the right strategies, you can convert casual readers into qualified leads and eventually paying customers.</p>

<h3>Strategy 1: Optimize Your CTAs</h3>
<p>Place compelling calls-to-action throughout your blog posts. Use contrasting colors, action-oriented language, and position them where readers are most engaged.</p>

<h3>Strategy 2: Create Lead Magnets</h3>
<p>Offer valuable downloadable content like ebooks, checklists, or templates in exchange for contact information.</p>

<h3>Strategy 3: Use Smart Popups</h3>
<p>Implement exit-intent popups and timed popups that capture attention without being intrusive.</p>

<h3>Strategy 4: Leverage Social Proof</h3>
<p>Display testimonials, case studies, and subscriber counts to build trust with new visitors.</p>

<h3>Strategy 5: Implement Contextual Chat</h3>
<p>Add AI-powered chatbots to your blog posts that can answer reader questions and capture contact details naturally.</p>

<h2>Measuring Success</h2>
<p>Track your conversion rates, monitor lead quality, and continuously optimize your approach. The best lead generation strategies evolve with your audience.</p>`,
      excerpt: 'Transform your blog into a lead generation powerhouse with these 10 proven strategies.',
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      status: 'Published',
      publishedAt: new Date(),
      seoTitle: '10 Lead Generation Strategies for Bloggers | Anti Gravity Blog',
      seoDescription: 'Proven strategies to generate high-quality leads from your blog content.',
      seoKeywords: 'lead generation, blog marketing, content marketing, conversion optimization',
      tags: ['Marketing', 'Business'],
    },
    {
      title: 'The Ultimate Guide to SEO-Optimized Blogging',
      slug: 'ultimate-guide-seo-optimized-blogging',
      content: `<h2>Master SEO for Your Blog</h2>
<p>Search Engine Optimization is the backbone of successful blogging. Without proper SEO, even the best content can go unnoticed. This guide covers everything you need to know to optimize your blog for search engines.</p>

<h3>Keyword Research</h3>
<p>Start with thorough keyword research. Use tools to find keywords with good search volume and manageable competition. Focus on long-tail keywords that match your audience's search intent.</p>

<h3>On-Page SEO</h3>
<ul>
<li>Write compelling meta titles and descriptions</li>
<li>Use proper heading hierarchy (H1, H2, H3)</li>
<li>Optimize images with alt text</li>
<li>Include internal and external links</li>
<li>Ensure fast page load times</li>
</ul>

<h3>Content Quality</h3>
<p>Search engines prioritize content that provides real value. Write in-depth articles that thoroughly cover your topic. Aim for comprehensive, well-researched content that answers your readers' questions.</p>

<h2>Technical SEO</h2>
<p>Don't forget the technical aspects: mobile responsiveness, site speed, XML sitemaps, and structured data. These factors significantly impact your search rankings.</p>`,
      excerpt: 'A comprehensive guide to optimizing your blog for search engines and driving organic traffic.',
      featuredImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200',
      status: 'Published',
      publishedAt: new Date(),
      seoTitle: 'Ultimate SEO Blogging Guide | Anti Gravity Blog',
      seoDescription: 'Everything you need to know about SEO-optimized blogging.',
      seoKeywords: 'SEO, blogging, search optimization, organic traffic, content marketing',
      tags: ['Tutorial', 'Marketing'],
    },
  ];

  for (const postData of samplePosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: postData.slug } });
    if (!existing) {
      const { tags: tagNames, ...post } = postData;
      const createdPost = await prisma.blogPost.create({ data: post });
      
      // Link tags
      for (const tagName of tagNames) {
        const tag = await prisma.tag.findUnique({ where: { slug: tagName.toLowerCase() } });
        if (tag) {
          await prisma.postTag.create({
            data: { postId: createdPost.id, tagId: tag.id },
          });
        }
      }
    }
  }
  console.log(`✅ ${samplePosts.length} Sample Blog Posts created`);

  // ==========================================
  // 6. Social Links
  // ==========================================
  const socialLinks = [
    { platform: 'whatsapp', label: 'Chat on WhatsApp', url: 'https://wa.me/919876543210', displayOrder: 1 },
    { platform: 'telegram', label: 'Join Telegram', url: 'https://t.me/antigravity', displayOrder: 2 },
    { platform: 'instagram', label: 'Follow on Instagram', url: 'https://instagram.com/antigravity', displayOrder: 3 },
    { platform: 'phone', label: 'Call Us', url: 'tel:+919876543210', displayOrder: 4 },
  ];

  const existingSocial = await prisma.socialLink.count();
  if (existingSocial === 0) {
    for (const link of socialLinks) {
      await prisma.socialLink.create({ data: link });
    }
    console.log(`✅ ${socialLinks.length} Social Links created`);
  }

  // ==========================================
  // 7. Sample Ad Placements
  // ==========================================
  const adPlacements = [
    {
      name: 'Header Banner Ad',
      position: 'header',
      adCode: '<!-- Google AdSense Header Ad Placeholder -->',
      publisherId: 'ca-pub-XXXXXXXXXXXXXXX',
      isActive: false,
      priority: 1,
    },
    {
      name: 'Sidebar Ad',
      position: 'sidebar',
      adCode: '<!-- Google AdSense Sidebar Ad Placeholder -->',
      publisherId: 'ca-pub-XXXXXXXXXXXXXXX',
      isActive: false,
      priority: 1,
    },
    {
      name: 'In-Content Ad',
      position: 'in_content',
      adCode: '<!-- Google AdSense In-Content Ad Placeholder -->',
      publisherId: 'ca-pub-XXXXXXXXXXXXXXX',
      isActive: false,
      priority: 1,
    },
  ];

  const existingAds = await prisma.adPlacement.count();
  if (existingAds === 0) {
    for (const ad of adPlacements) {
      await prisma.adPlacement.create({ data: ad });
    }
    console.log(`✅ ${adPlacements.length} Ad Placements created`);
  }

  // ==========================================
  // 8. Sample Auto-Blog Keywords
  // ==========================================
  const keywords = [
    { keyword: 'AI automation for small business', niche: 'AI', priority: 5 },
    { keyword: 'how to use chatgpt for blogging', niche: 'AI', priority: 4 },
    { keyword: 'best passive income ideas 2025', niche: 'Business', priority: 3 },
    { keyword: 'digital marketing trends', niche: 'Marketing', priority: 2 },
    { keyword: 'website monetization strategies', niche: 'Business', priority: 1 },
  ];

  const existingKeywords = await prisma.autoBlogKeyword.count();
  if (existingKeywords === 0) {
    for (const kw of keywords) {
      await prisma.autoBlogKeyword.create({ data: kw });
    }
    console.log(`✅ ${keywords.length} Auto-Blog Keywords added`);
  }

  // ==========================================
  // 9. About Settings
  // ==========================================
  await prisma.aboutSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heading: 'About Anti Gravity',
      content: 'We build AI-powered solutions that automate content creation, lead generation, and business growth.',
      mission: 'To democratize AI technology and make it accessible for every content creator and business.',
    },
  });
  console.log('✅ About Settings configured');

  console.log('\n🎉 Database seeding complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Admin Login: ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
