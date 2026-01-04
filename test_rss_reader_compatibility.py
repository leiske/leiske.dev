#!/usr/bin/env python3
"""
Test script to validate RSS and Atom feeds work correctly with RSS readers.
This simulates what an RSS reader would do when parsing feeds.
"""

import xml.etree.ElementTree as ET
import urllib.request
from urllib.parse import urljoin
import sys


def test_rss_feed(url):
    """Test RSS 2.0 feed structure and content."""
    print(f"\n{'='*60}")
    print(f"Testing RSS Feed: {url}")
    print('='*60)

    try:
        with urllib.request.urlopen(url) as response:
            content = response.read()

        # Parse XML
        root = ET.fromstring(content)

        # Verify RSS version
        rss_version = root.get('version')
        print(f"✓ RSS Version: {rss_version}")
        assert rss_version == '2.0', f"Expected RSS 2.0, got {rss_version}"

        # Find channel element
        channel = root.find('channel')
        assert channel is not None, "Missing channel element"

        # Check required channel elements
        required_channel_elements = ['title', 'link', 'description']
        for elem_name in required_channel_elements:
            elem = channel.find(elem_name)
            assert elem is not None and elem.text, f"Missing required channel element: {elem_name}"
            print(f"✓ Channel {elem_name}: {elem.text}")

        # Check optional but recommended elements
        optional_elements = ['language', 'copyright', 'lastBuildDate', 'generator']
        for elem_name in optional_elements:
            elem = channel.find(elem_name)
            if elem is not None:
                print(f"✓ Channel {elem_name}: {elem.text}")

        # Check items
        items = channel.findall('item')
        print(f"✓ Found {len(items)} items")
        assert len(items) > 0, "No items found in feed"

        # Verify first item has required elements
        if items:
            first_item = items[0]
            required_item_elements = ['title', 'link', 'description']
            for elem_name in required_item_elements:
                elem = first_item.find(elem_name)
                assert elem is not None and elem.text, f"Missing required item element: {elem_name}"
                content = elem.text if elem_name != 'description' else elem.text[:50] + '...'
                print(f"✓ Item {elem_name}: {content}")

            # Check for optional item elements
            optional_item_elements = ['pubDate', 'author', 'guid']
            for elem_name in optional_item_elements:
                elem = first_item.find(elem_name)
                if elem is not None:
                    print(f"✓ Item {elem_name}: {elem.text}")

        print("\n✅ RSS Feed: VALID - All required elements present")
        return True

    except Exception as e:
        print(f"\n❌ RSS Feed: INVALID - {str(e)}")
        return False


def test_atom_feed(url):
    """Test Atom 1.0 feed structure and content."""
    print(f"\n{'='*60}")
    print(f"Testing Atom Feed: {url}")
    print('='*60)

    try:
        with urllib.request.urlopen(url) as response:
            content = response.read()

        # Parse XML - Atom uses namespace
        root = ET.fromstring(content)

        # Check namespace
        namespace = {'atom': 'http://www.w3.org/2005/Atom'}
        print(f"✓ Atom Namespace: {namespace['atom']}")

        # Verify root is 'feed' element
        assert root.tag.endswith('feed'), f"Expected 'feed' element, got {root.tag}"

        # Check required feed elements
        required_feed_elements = ['id', 'title', 'updated']
        for elem_name in required_feed_elements:
            elem = root.find(f'atom:{elem_name}', namespace)
            assert elem is not None and elem.text, f"Missing required feed element: {elem_name}"
            print(f"✓ Feed {elem_name}: {elem.text}")

        # Check subtitle (recommended)
        subtitle = root.find('atom:subtitle', namespace)
        if subtitle is not None:
            print(f"✓ Feed subtitle: {subtitle.text}")

        # Check for rights (copyright)
        rights = root.find('atom:rights', namespace)
        if rights is not None:
            print(f"✓ Feed rights: {rights.text}")

        # Check entries
        entries = root.findall('atom:entry', namespace)
        print(f"✓ Found {len(entries)} entries")
        assert len(entries) > 0, "No entries found in feed"

        # Verify first entry has required elements
        if entries:
            first_entry = entries[0]
            required_entry_elements = ['id', 'title', 'updated']
            for elem_name in required_entry_elements:
                elem = first_entry.find(f'atom:{elem_name}', namespace)
                assert elem is not None and elem.text, f"Missing required entry element: {elem_name}"
                content = elem.text
                print(f"✓ Entry {elem_name}: {content}")

            # Check for link
            link = first_entry.find('atom:link', namespace)
            if link is not None:
                href = link.get('href')
                print(f"✓ Entry link: {href}")

            # Check for summary or content
            summary = first_entry.find('atom:summary', namespace)
            content_elem = first_entry.find('atom:content', namespace)
            if summary is not None and summary.text:
                print(f"✓ Entry summary: {summary.text[:50]}...")
            elif content_elem is not None and content_elem.text:
                print(f"✓ Entry content: {content_elem.text[:50]}...")

            # Check for author
            author = first_entry.find('atom:author', namespace)
            if author is not None:
                name = author.find('atom:name', namespace)
                email = author.find('atom:email', namespace)
                author_info = []
                if name is not None:
                    author_info.append(name.text)
                if email is not None:
                    author_info.append(email.text)
                print(f"✓ Entry author: {', '.join(author_info)}")

        print("\n✅ Atom Feed: VALID - All required elements present")
        return True

    except Exception as e:
        print(f"\n❌ Atom Feed: INVALID - {str(e)}")
        return False


def main():
    """Main test function."""
    print("\n" + "="*60)
    print("RSS/Atom Feed Reader Compatibility Test")
    print("This test validates that feeds are parseable by RSS readers")
    print("="*60)

    # Test URLs
    base_url = "http://localhost:3001"
    rss_url = f"{base_url}/feed.xml"
    atom_url = f"{base_url}/atom.xml"

    # Run tests
    rss_valid = test_rss_feed(rss_url)
    atom_valid = test_atom_feed(atom_url)

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"RSS Feed: {'✅ PASS' if rss_valid else '❌ FAIL'}")
    print(f"Atom Feed: {'✅ PASS' if atom_valid else '❌ FAIL'}")

    if rss_valid and atom_valid:
        print("\n🎉 Both feeds are valid and compatible with RSS readers!")
        print("   Feeds include all required elements for RSS/Atom standards.")
        print("   RSS readers should be able to parse and display these feeds.")
        return 0
    else:
        print("\n⚠️  One or more feeds failed validation")
        return 1


if __name__ == '__main__':
    sys.exit(main())
