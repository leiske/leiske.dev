#!/usr/bin/env python3
"""Validate RSS and Atom feeds"""

import xml.etree.ElementTree as ET
import urllib.request
import sys

def validate_xml(content, feed_type):
    """Validate XML structure and feed-specific requirements"""
    try:
        root = ET.fromstring(content)
        print(f"✓ XML is well-formed ({feed_type})")
    except ET.ParseError as e:
        print(f"✗ XML parsing failed ({feed_type}): {e}")
        return False

    # Validate RSS 2.0
    if feed_type == "RSS":
        if root.tag != "rss":
            print(f"✗ Invalid root element for RSS: {root.tag}")
            return False
        version = root.get("version")
        if version != "2.0":
            print(f"✗ Invalid RSS version: {version}")
            return False
        print(f"✓ RSS version 2.0 detected")

        # Check for required channel elements
        channel = root.find("channel")
        if channel is None:
            print("✗ No channel element found")
            return False

        required_elements = ["title", "link", "description"]
        for elem in required_elements:
            if channel.find(elem) is None:
                print(f"✗ Missing required channel element: {elem}")
                return False

        print("✓ Required channel elements present (title, link, description)")

        # Count items
        items = channel.findall("item")
        print(f"✓ Found {len(items)} items in RSS feed")

        # Check first item has required fields
        if len(items) > 0:
            item = items[0]
            item_required = ["title", "link", "description"]
            for elem in item_required:
                if item.find(elem) is None:
                    print(f"⚠ First item missing element: {elem}")
                else:
                    print(f"✓ First item has {elem}")

    # Validate Atom 1.0
    elif feed_type == "Atom":
        if root.tag != "{http://www.w3.org/2005/Atom}feed":
            print(f"✗ Invalid root element for Atom: {root.tag}")
            return False
        print(f"✓ Atom 1.0 namespace detected")

        # Check for required elements
        atom_ns = "{http://www.w3.org/2005/Atom}"
        required_elements = ["id", "title", "updated"]
        for elem in required_elements:
            found = root.find(f"{atom_ns}{elem}")
            if found is None:
                print(f"✗ Missing required element: {elem}")
                return False
        print("✓ Required elements present (id, title, updated)")

        # Count entries
        entries = root.findall(f"{atom_ns}entry")
        print(f"✓ Found {len(entries)} entries in Atom feed")

        # Check first entry has required fields
        if len(entries) > 0:
            entry = entries[0]
            entry_required = ["title", "id", "updated"]
            for elem in entry_required:
                found = entry.find(f"{atom_ns}{elem}")
                if found is None:
                    print(f"⚠ First entry missing element: {elem}")
                else:
                    print(f"✓ First entry has {elem}")

    return True

def main():
    print("=" * 60)
    print("Feed Validator")
    print("=" * 60)

    # Try different ports
    ports = ["8789", "8788", "3000", "3001"]
    base_url = None

    for port in ports:
        try:
            test_url = f"http://localhost:{port}/feed.xml"
            urllib.request.urlopen(test_url, timeout=2)
            base_url = f"http://localhost:{port}"
            print(f"\n✓ Server found on port {port}")
            break
        except Exception:
            continue

    if base_url is None:
        print("\n✗ No server found on ports 3000, 3001, or 8788")
        print("Please start the dev server with: npm run dev")
        print("Or start wrangler dev with: npx wrangler dev dist/server/index.js --config wrangler.jsonc")
        sys.exit(1)

    # Test RSS feed
    print(f"\nValidating RSS feed from {base_url}/feed.xml")
    print("-" * 60)
    try:
        response = urllib.request.urlopen(f"{base_url}/feed.xml")
        rss_content = response.read().decode("utf-8")
        validate_xml(rss_content, "RSS")
    except Exception as e:
        print(f"✗ Failed to fetch RSS feed: {e}")
        sys.exit(1)

    # Test Atom feed
    print(f"\nValidating Atom feed from {base_url}/atom.xml")
    print("-" * 60)
    try:
        response = urllib.request.urlopen(f"{base_url}/atom.xml")
        atom_content = response.read().decode("utf-8")
        validate_xml(atom_content, "Atom")
    except Exception as e:
        print(f"✗ Failed to fetch Atom feed: {e}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("✓ All feeds validated successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
