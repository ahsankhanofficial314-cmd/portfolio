#!/usr/bin/env node

/**
 * Portfolio Deployment Automation Script
 * Does ALL the setup and deployment automatically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function deploy() {
    try {
        log('\n🚀 PORTFOLIO DEPLOYMENT AUTOMATION', 'blue');
        log('====================================\n', 'blue');

        // Step 1: Check if user is logged in to Vercel
        log('1️⃣  Checking Vercel authentication...', 'yellow');
        try {
            execSync('vercel whoami', { stdio: 'pipe' });
            log('✅ Already logged in to Vercel\n', 'green');
        } catch (e) {
            log('⏳ You need to login to Vercel. Opening login page...\n', 'yellow');
            execSync('vercel login', { stdio: 'inherit' });
            log('✅ Logged in to Vercel\n', 'green');
        }

        // Step 2: Link project
        log('2️⃣  Linking project to Vercel...', 'yellow');
        try {
            execSync('vercel link --yes', { stdio: 'inherit', cwd: process.cwd() });
            log('✅ Project linked\n', 'green');
        } catch (e) {
            log('Project already linked or skipping link step\n', 'yellow');
        }

        // Step 3: Set Environment Variables
        log('3️⃣  Setting environment variables on Vercel...', 'yellow');
        const envVars = {
            MONGO_URI: 'mongodb://ahsankhan:NOC72PwPGXghJBqn@ac-qheuklc-shard-00-00.l9yhh1p.mongodb.net:27017,ac-qheuklc-shard-00-01.l9yhh1p.mongodb.net:27017,ac-qheuklc-shard-00-02.l9yhh1p.mongodb.net:27017/portfolio?authSource=admin&retryWrites=true&w=majority&tls=true',
            EMAIL_USER: 'ahsankhanofficial314@gmail.com',
            EMAIL_PASS: 'ahsankhan0099'
        };

        for (const [key, value] of Object.entries(envVars)) {
            try {
                execSync(`vercel env add ${key}`, { 
                    input: `${value}\n`,
                    stdio: 'pipe'
                });
                log(`  ✅ ${key} added`, 'green');
            } catch (e) {
                log(`  ℹ️  ${key} may already exist`, 'yellow');
            }
        }
        log('✅ Environment variables configured\n', 'green');

        // Step 4: Deploy
        log('4️⃣  Deploying to Vercel...', 'yellow');
        const deployOutput = execSync('vercel --prod', { encoding: 'utf-8', stdio: 'pipe' });
        
        // Extract the deployment URL
        const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
        const deploymentUrl = urlMatch ? urlMatch[0] : 'https://vercel.com';
        
        log('✅ Deployment successful!\n', 'green');

        // Step 5: Summary
        log('\n🎉 DEPLOYMENT COMPLETE!', 'green');
        log('====================================', 'green');
        log(`\n📍 Your portfolio is live at: ${deploymentUrl}\n`, 'blue');
        log('What happens next:', 'yellow');
        log('  1. Visit your website', 'reset');
        log('  2. Fill out the contact form', 'reset');
        log('  3. Check your email (ahsankhanofficial314@gmail.com) within seconds', 'reset');
        log('\n⚠️  First deployment may take 1-2 minutes to fully process.', 'yellow');
        log('If email fails, regenerate Gmail App Password at:', 'yellow');
        log('   https://myaccount.google.com/apppasswords\n', 'reset');

    } catch (error) {
        log(`\n❌ Deployment failed: ${error.message}\n`, 'red');
        process.exit(1);
    }
}

deploy();
